import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getRandomString, pool } from '../../helpers';
import { Client, Game, Player, Room, Round, SubmitScore, UpdatedGame, UpdatedRoom, UpdatedRound, Vote } from '../../models';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { findMatchingClientsForUserIds, sendMessageToClient } from '../sockets/methods';
import { UpdatedPlayers } from '../../models/sockets/planning-poker/updated-players';

export const saveRoomToDb = async (room: Room, userId: number, generateId: boolean = true): Promise<Room> => {
    if (generateId) {
        room.id = await getUniqueId();
    }
    await pool.query(
        `INSERT INTO pp_rooms
            (id, name, description, created_at, updated_at)
        VALUES
            (?, ?, ?, ?, ?)`,
        [room.id, room.name, room.description, room.createdAt, room.updatedAt]
    );
    await pool.query(
        `INSERT INTO pp_room_players
            (room_id, user_id, online, updated_at, role)
        VALUES
            (?, ?, ?, ?, 'owner')`,
        [room.id, userId, true, room.updatedAt]
    );
    return room;
};

export const getRoomsFromDbForUser = async (userId: number): Promise<Room[]> => {
    const [roomIdsRows] = await pool.query<RowDataPacket[]>(
        'SELECT room_id FROM pp_room_players WHERE user_id = ?',
        [userId]
    );

    if (roomIdsRows.length === 0) {
        return [];
    }

    const roomIds = roomIdsRows.map((row: RowDataPacket) => row.room_id);

    const [result] = await pool.query<Room[] & RowDataPacket[]>(
        'SELECT * FROM pp_rooms WHERE id IN (?)',
        [roomIds]
    );
    const rooms = await convertResultToRooms(result);
    return rooms;
};

export const joinRoomByRoomId = async (roomId: string, userId: number): Promise<void> => {
    await pool.query(
        `INSERT INTO pp_room_players
            (room_id, user_id, online)
        VALUES
            (?, ?, 1)
        ON DUPLICATE KEY UPDATE
            online = true`,
        [roomId, userId]
    );
};

export const createGameAndSaveToDb = async (roomId: string, name: string, userId: number): Promise<number> => {
    if (!await doesRoomExist(roomId)) {
        throw new Error('Room not found');
    }
    if (await doesGameExist(undefined, roomId, name)) {
        throw new Error('Game already exists');
    }
    await finishActiveGamesForRoom(roomId);
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO pp_games
            (room_id, name, in_progress, created_by)
        VALUES
            (?, ?, 1, ?)`,
        [roomId, name, userId]
    );
    const gameId = result.insertId;
    await createRoundAndSaveToDb(gameId);
    return gameId;
};

const doesRoomExist = async (roomId: string): Promise<boolean> => {
    const [result] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM pp_rooms WHERE id = ?',
        [roomId]
    );
    return result.length > 0;
};

const doesGameExist = async (gameId?: number, roomId?: string, name?: string): Promise<boolean> => {
    if (gameId != null) {
        const [result] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM pp_games WHERE id = ?',
            [gameId]
        );
        return result.length > 0;
    }
    if (roomId != null && name != null) {
        const [result] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM pp_games WHERE room_id = ? AND name = ?',
            [roomId, name]
        );
        return result.length > 0;
    }
    return false;
};

export const finishActiveGamesForRoom = async (roomId?: string, gameId?: number, success?: boolean): Promise<void> => {
    const param = roomId != null ? roomId : gameId;
    if (param == null) {
        return;
    }
    let query = '';
    if (roomId != null) {
        query = 'SELECT id FROM pp_games WHERE room_id = ? AND in_progress = 1';
    } else if (gameId != null) {
        query = 'SELECT id FROM pp_games WHERE id = ? AND in_progress = 1';
    }
    const [activeGames] = await pool.query<RowDataPacket[]>(
        query,
        [param]
    );

    if (activeGames.length === 0) {
        return;
    }

    for (const gameRow of activeGames) {
        const gameId = gameRow.id;
        await finishActiveRoundsForGame(gameId);
        const finalEstimate = await getFinalEstimateForGame(gameId);
        await pool.query(
            `UPDATE pp_games
            SET
                in_progress = 0,
                game_success = ?,
                final_estimate = ?
            WHERE id = ?`,
            [success, finalEstimate, gameId]
        );
    }
};

const getFinalEstimateForGame = async (gameId: number): Promise<number> => {
    const [rounds] = await pool.query<RowDataPacket[]>(
        'SELECT median_score FROM pp_rounds WHERE game_id = ? ORDER BY ended_at DESC LIMIT 1',
        [gameId]
    );
    if (rounds.length === 0) {
        return 0;
    }
    return rounds[0].median_score;
};

export const createRoundAndSaveToDb = async (gameId: number): Promise<void> => {
    if (!await doesGameExist(gameId)) {
        throw new Error('Game does not exist');
    }
    await finishActiveRoundsForGame(gameId);
    await pool.query(
        `INSERT INTO pp_rounds
            (room_id, game_id, in_progress)
        SELECT 
            room_id, ?, 1
        FROM pp_games 
        WHERE id = ?`,
        [gameId, gameId]
    );
};

export const finishActiveRoundsForGame = async (gameId?: number, roundId?: number): Promise<void> => {
    const param = gameId != null ? gameId : roundId;
    if (param == null) {
        return;
    }
    let query = '';
    if (gameId != null) {
        query = 'SELECT id FROM pp_rounds WHERE game_id = ? AND in_progress = 1';
    } else if (roundId != null) {
        query = 'SELECT id FROM pp_rounds WHERE id = ? AND in_progress = 1';
    }
    const [activeRounds] = await pool.query<RowDataPacket[]>(
        query,
        [param]
    );

    if (activeRounds.length === 0) {
        return;
    }

    for (const roundRow of activeRounds) {
        const roundId = roundRow.id;

        // First, check if there are any scores for this round
        const [scoreCount] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM pp_votes WHERE round_id = ?',
            [roundId]
        );

        let total = 0;
        let mean = 0;
        let lowest = 0;
        let highest = 0;
        let differentCounts = 0;
        let median = 0;
        let mode = 0;

        if (scoreCount[0].count > 0) {
            const [allScores] = await pool.query<RowDataPacket[]>(
                'SELECT value FROM pp_votes WHERE round_id = ?',
                [roundId]
            );

            const numericValues = allScores
                .map(s => {
                    if (s.value === '1/2') {
                        return 0.5;
                    }
                    return s.value;
                })
                .filter(val => /^\d+(\.\d+)?$/.test(val))
                .map(val => parseFloat(val))
                .filter(n => !isNaN(n));

            if (numericValues.length > 0) {
                total = numericValues.reduce((sum, val) => sum + val, 0);
                mean = total / numericValues.length;
                numericValues.sort((a, b) => a - b);
                lowest = numericValues[0];
                highest = numericValues[numericValues.length - 1];

                median = calculateMedian(numericValues);
                mode = calculateMode(numericValues);
            }

            const [distinctCount] = await pool.query<RowDataPacket[]>(
                'SELECT COUNT(DISTINCT value) as count FROM pp_votes WHERE round_id = ?',
                [roundId]
            );
            differentCounts = distinctCount[0].count;
        }

        await pool.query(
            `UPDATE pp_rounds
            SET
                in_progress = 0,
                total_score = ?,
                median_score = ?,
                mean_score = ?,
                mode_score = ?,
                lowest_score = ?,
                highest_score = ?,
                count_of_different_scores = ?,
                ended_at = ?
            WHERE id = ?`,
            [
                total,
                median,
                mean,
                mode,
                lowest,
                highest,
                differentCounts,
                new Date(),
                roundId,
            ]
        );
    }
};

const calculateMedian = (sortedValues: number[]): number => {
    if (sortedValues.length === 0) return 0;

    const mid = Math.floor(sortedValues.length / 2);
    return sortedValues.length % 2 === 0
        ? (sortedValues[mid - 1] + sortedValues[mid]) / 2
        : sortedValues[mid];
};

const calculateMode = (values: number[]): number => {
    if (values.length === 0) return 0;

    const frequency: Record<number, number> = {};
    let maxFreq = 0;
    let mode = 0;

    values.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1;
        if (frequency[val] > maxFreq) {
            maxFreq = frequency[val];
            mode = val;
        }
    });

    return mode;
};

export const getRoomDetails = async (roomId: string): Promise<Room | undefined> => {
    const [result] = await pool.query<Room[] & RowDataPacket[]>(
        'SELECT * FROM pp_rooms WHERE id = ?',
        [roomId]
    );
    if (result.length === 0) {
        return undefined;
    }
    const room = await convertResultToRooms(result);
    return room[0];
};

const getUniqueId = async (attempts: number = 0): Promise<string> => {
    if (attempts > 10) {
        throw new Error('Could not generate unique id');
    }
    let id = getRandomString(8);
    const [result] = await pool.query<RowDataPacket[]>(
        `SELECT id
        FROM pp_rooms
        WHERE id = ?`,
        [id]
    );
    if (result.length > 0) {
        id = await getUniqueId(attempts + 1);
    }
    return id;
};

const convertResultToRooms = async (result: Room[]): Promise<Room[]> => {
    const rooms = await Promise.all(result.map(async (row: Room) => {
        const room = plainToInstance(Room, row, { excludeExtraneousValues: true });
        room.players = await getPlayersForRoom(room.id);
        room.games = await getGamesForRoom(room.id);
        return room;
    }));
    await Promise.all(rooms.map(room => validateOrReject(room)));
    return rooms;
};

/**
 * Each property is optional, none can be provided, or all 3.
 * @param roomId Optional
 * @param gameId Optional
 * @param roundId Optional
 * @returns Array of Players
 */
const getPlayersForRoom = async (roomId?: string, gameId?: number, roundId?: number): Promise<Player[]> => {
    let sql = 'SELECT u.*, rp.room_id, rp.online, rp.role FROM users u JOIN pp_room_players rp ON u.id = rp.user_id';

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (roomId) {
        conditions.push('rp.room_id = ?');
        params.push(roomId);
    }

    if (gameId) {
        sql += ' JOIN pp_games g ON g.room_id = rp.room_id';
        conditions.push('g.id = ?');
        params.push(gameId);
    }

    if (roundId) {
        if (!gameId) {
            sql += ' JOIN pp_games g ON g.room_id = rp.room_id';
        }
        sql += ' JOIN pp_rounds r ON r.game_id = g.id';
        conditions.push('r.id = ?');
        params.push(roundId);
    }

    conditions.push('rp.updated_at > DATE_SUB(NOW(), INTERVAL 7 DAY)');

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    const [result] = await pool.query<Player[] & RowDataPacket[]>(sql, params);

    const players = result.map((row: Player) => {
        const player: Player = plainToInstance(Player, row, { excludeExtraneousValues: true });
        player.password = '';
        return player;
    });
    await Promise.all(players.map(player => validateOrReject(player)));
    return players;
};

const getGamesForRoom = async (roomId: string): Promise<Game[]> => {
    const [result] = await pool.query<Game[] & RowDataPacket[]>(
        'SELECT * FROM pp_games WHERE room_id = ?',
        [roomId]
    );
    const games = await Promise.all(result.map(async (row: Game) => {
        const game = plainToInstance(Game, row, { excludeExtraneousValues: true });
        game.rounds = await getRoundsForGame(game.id);
        return game;
    }));
    await Promise.all(games.map(game => validateOrReject(game)));
    return games;
};

const getRoundsForGame = async (gameId: number): Promise<Round[]> => {
    const [result] = await pool.query<Round[] & RowDataPacket[]>(
        'SELECT * FROM pp_rounds WHERE game_id = ?',
        [gameId]
    );
    const rounds = await Promise.all(result.map(async (row: Round) => {
        const round = plainToInstance(Round, row, { excludeExtraneousValues: true });
        round.votes = await getVotesForRound(round.id);
        return round;
    }));
    await Promise.all(rounds.map(round => validateOrReject(round)));
    return rounds;
};

const getVotesForRound = async (roundId: number): Promise<Vote[]> => {
    const [result] = await pool.query<Vote[] & RowDataPacket[]>(
        'SELECT * FROM pp_votes WHERE round_id = ?',
        [roundId]
    );
    const votes = result.map((row: Vote) => plainToInstance(Vote, row, { excludeExtraneousValues: true }));
    await Promise.all(votes.map(vote => validateOrReject(vote)));
    return votes;
};

export const connectToRoom = async (roomId: string, userId: number): Promise<void> => {
    await pool.query(
        `UPDATE pp_room_players
        SET online = 1
        WHERE room_id = ? AND user_id = ?`,
        [roomId, userId]
    );
};

export const disconnectFromRoom = async (roomId: string, userId: number): Promise<void> => {
    await pool.query(
        `UPDATE pp_room_players
        SET online = 0
        WHERE room_id = ? AND user_id = ?`,
        [roomId, userId]
    );
};

export const saveScoreToDb = async (submitScore: SubmitScore): Promise<void> => {
    const vote = plainToInstance(Vote, submitScore.vote, { excludeExtraneousValues: true });
    await validateOrReject(vote);
    await pool.query(
        `INSERT INTO pp_votes
            (room_id, round_id, user_id, value, created_at)
        VALUES
            (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            value = ?,
            created_at = ?`,
        [vote.roomId, vote.roundId, vote.userId, vote.value, vote.createdAt, vote.value, vote.createdAt]
    );
};

export const getClients = async (roomId?: string, gameId?: number, roundId?: number): Promise<Client[]> => {
    const players = await getPlayersForRoom(roomId, gameId, roundId);
    return findMatchingClientsForUserIds(players.map(player => player.id));
};

export const getGameById = async (gameId: number): Promise<Game | undefined> => {
    const [result] = await pool.query<Game[] & RowDataPacket[]>(
        'SELECT * FROM pp_games WHERE id = ?',
        [gameId]
    );
    if (result.length === 0) {
        return undefined;
    }
    const game = plainToInstance(Game, result[0], { excludeExtraneousValues: true });
    game.rounds = await getRoundsForGame(game.id);
    await validateOrReject(game);
    return game;
};

export const getRoundById = async (roundId: number): Promise<Round | undefined> => {
    const [result] = await pool.query<Round[] & RowDataPacket[]>(
        'SELECT * FROM pp_rounds WHERE id = ?',
        [roundId]
    );
    if (result.length === 0) {
        return undefined;
    }
    const round = plainToInstance(Round, result[0], { excludeExtraneousValues: true });
    round.votes = await getVotesForRound(round.id);
    await validateOrReject(round);
    return round;
};

export const validateThenUpdateRoom = async (
    userId: number,
    roomId: string,
    name: string,
    description: string,
    updatedPlayers: Player[],
    removedPlayers: Player[]
): Promise<Room> => {
    const completed = await updatePlayersForRoom(userId, roomId, updatedPlayers, removedPlayers);
    const room = await getRoomDetails(roomId);
    if (room == null) {
        throw new Error('Room not found');
    }
    if (!completed) {
        const player = room.players.find(player => player.id === userId);
        if (player == null) {
            throw new Error('User is not part of room');
        }
        if (player.role !== 'owner') {
            throw new Error('User is not owner of room');
        }
    }
    room.name = name;
    room.description = description;
    await validateOrReject(room);
    await pool.query(
        `UPDATE pp_rooms
        SET name = ?, description = ?
        WHERE id = ?`,
        [room.name, room.description, room.id]
    );
    return room;
};

const updatePlayersForRoom = async (userId: number, roomId: string, updatedPlayers: Player[], removedPlayers: Player[]): Promise<boolean> => {
    const players = await getPlayersForRoom(roomId);
    if (players.length === 0) {
        throw new Error('Room has no players');
    }
    const player = players.find(p => p.id === userId);
    if (player == null) {
        throw new Error('User not found in room');
    }
    if (player.role !== 'owner') {
        throw new Error('User is not owner of room');
    }
    if (updatedPlayers.length === 0 && removedPlayers.length === 0) {
        return true;
    }
    if (removedPlayers.length > 0) {
        await pool.query<ResultSetHeader>(
            'DELETE FROM pp_room_players WHERE room_id = ? AND user_id IN (?)',
            [roomId, removedPlayers.map((p) => p.id)]
        );
    }
    if (updatedPlayers.length > 0) {
        const toUpdate = updatedPlayers.filter(p => !removedPlayers.find(r => r.id === p.id));
        const promises = toUpdate.map(player =>
            pool.query<ResultSetHeader>(
                `UPDATE pp_room_players 
                SET role = ? 
                WHERE room_id = ? AND user_id = ?`,
                [player.role, roomId, player.id]
            )
        );
        await Promise.all(promises);
    }
    return true;
};

export const sendRoomToClients = async (roomId: string, room?: Room): Promise<void> => {
    const foundClients = await getClients(roomId);
    if (foundClients.length === 0) {
        return;
    }
    if (room == null) {
        room = await getRoomDetails(roomId);
    }
    if (room == null) {
        throw new Error('Room not found');
    }
    const message: UpdatedRoom = new UpdatedRoom(room);
    foundClients.forEach((clientForRoom: Client) => {
        sendMessageToClient(message, clientForRoom.userId);
    });
};

export const sendPlayersToClients = async (roomId: string, players?: Player[]): Promise<void> => {
    const foundClients = await getClients(roomId);
    if (foundClients.length === 0) {
        return;
    }
    if (players == null) {
        players = await getPlayersForRoom(roomId);
    }
    const message: UpdatedPlayers = new UpdatedPlayers(players);
    foundClients.forEach((clientForRoom: Client) => {
        sendMessageToClient(message, clientForRoom.userId);
    });
};

export const sendGameToClients = async (gameId: number, game?: Game): Promise<void> => {
    const foundClients = await getClients(undefined, gameId);
    if (foundClients.length === 0) {
        return;
    }
    if (game == null) {
        game = await getGameById(gameId);
    }
    if (game == null) {
        throw new Error('Game not found');
    }
    const message: UpdatedGame = new UpdatedGame(game);
    foundClients.forEach((clientForGame: Client) => {
        sendMessageToClient(message, clientForGame.userId);
    });
};

export const sendRoundToClients = async (roundId: number, round?: Round): Promise<void> => {
    const foundClients = await getClients(undefined, undefined, roundId);
    if (foundClients.length === 0) {
        return;
    }
    if (round == null) {
        round = await getRoundById(roundId);
    }
    if (round == null) {
        throw new Error('Round not found');
    }
    const message: UpdatedRound = new UpdatedRound(round);
    foundClients.forEach((clientForRound: Client) => {
        sendMessageToClient(message, clientForRound.userId);
    });
};

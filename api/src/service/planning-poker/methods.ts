import { RowDataPacket } from "mysql2";
import { getRandomString, pool } from "../../helpers";
import { Game, Player, Room, Round, Vote } from "../../models";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { get } from "http";

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
            (room_id, user_id, online, updated_at)
        VALUES
            (?, ?, ?, ?)`,
        [room.id, userId, true, room.updatedAt]
    );
    return room;
};

export const getRoomsFromDbForUser = async (userId: number): Promise<Room[]> => {
    const [roomIdsRows] = await pool.query<RowDataPacket[]>(
        `SELECT room_id FROM pp_room_players WHERE user_id = ?`,
        [userId]
    );

    if (roomIdsRows.length === 0) {
        return [];
    }

    const roomIds = roomIdsRows.map((row: RowDataPacket) => row.room_id);

    const [rooms] = await pool.query<Room[] & RowDataPacket[]>(
        `SELECT * FROM pp_rooms WHERE id IN (?)`,
        [roomIds]
    );
    const validRooms = await convertResultToRooms(rooms);
    const roomsWithPlayers: Room[] = await Promise.all(validRooms.map(async (room: Room) => {
        room.players = await getPlayersForRoom(room.id);
        room.games = await getGamesForRoom(room.id);
        return room;
    }));
    return roomsWithPlayers;
};

export const getRoomDetails = async (roomId: string): Promise<Room | undefined> => {
    const [result] = await pool.query<Room[] & RowDataPacket[]>(
        `SELECT * FROM pp_rooms WHERE id = ?`,
        [roomId]
    );
    if (result.length === 0) {
        return undefined;
    }
    const room = await convertResultToRooms(result);
    room[0].players = await getPlayersForRoom(roomId);
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
}

const convertResultToRooms = async (result: Room[]): Promise<Room[]> => {
    return await Promise.all(result.map(async (row: Room) => {
        const room = plainToInstance(Room, row, { excludeExtraneousValues: true });
        room.games = await getGamesForRoom(room.id);
        await validateOrReject(room);
        return room;
    }));
};


const getPlayersForRoom = async (roomId: string): Promise<Player[]> => {
    const [players] = await pool.query<Player[] & RowDataPacket[]>(
        `SELECT u.*, rp.online, rp.role
        FROM users u
        JOIN pp_room_players rp ON u.id = rp.user_id
        WHERE rp.room_id = ?
        AND rp.updated_at > DATE_SUB(NOW(), INTERVAL 7 DAY)`,
        [roomId]
    );
    return await Promise.all(players.map(async (row: Player) => {
        const player: Player = plainToInstance(Player, row, { excludeExtraneousValues: true });
        player.password = '';
        await validateOrReject(player);
        return player;
    }));
};

const getGamesForRoom = async (roomId: string): Promise<Game[]> => {
    const [games] = await pool.query<Game[] & RowDataPacket[]>(
        `SELECT * FROM pp_games WHERE room_id = ?`,
        [roomId]
    );
    return await Promise.all(games.map(async (row: Game) => {
        const game = plainToInstance(Game, row, { excludeExtraneousValues: true });
        game.rounds = await getRoundsForGame(game.id);
        await validateOrReject(game);
        return game;
    }));
};

const getRoundsForGame = async (gameId: number): Promise<Round[]> => {
    const [rounds] = await pool.query<Round[] & RowDataPacket[]>(
        `SELECT * FROM pp_rounds WHERE game_id = ?`,
        [gameId]
    );
    return await Promise.all(rounds.map(async (row: Round) => {
        const round = plainToInstance(Round, row, { excludeExtraneousValues: true });
        round.votes = await getVotesForRound(round.id);
        await validateOrReject(round);
        return round;
    }));
};

const getVotesForRound = async (roundId: number): Promise<Vote[]> => {
    const [votes] = await pool.query<Vote[] & RowDataPacket[]>(
        `SELECT * FROM pp_scores WHERE round_id = ?`,
        [roundId]
    );
    return await Promise.all(votes.map(async (row: Vote) => {
        const vote = plainToInstance(Vote, row, { excludeExtraneousValues: true });
        await validateOrReject(vote);
        return vote;
    }));
};

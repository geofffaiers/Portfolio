import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdatedPlayers } from '@src/models/sockets/planning-poker';
import { Player } from '@src/models/planning-poker/player';
import { MessageType } from '@src/models';
import { mockPlayer } from '@mocks/models/planning-poker/player';

const mockPlayerInstance = (): Player => {
    return plainToInstance(Player, mockPlayer('room-1'));
};

const newPlainObject = (players?: Player[]) => {
    return {
        type: MessageType.UPDATED_PLAYERS,
        players
    };
};

describe('UpdatedPlayers model', () => {
    it('should transform plain object to UpdatedPlayers instance with nested Player array', () => {
        const plain = newPlainObject([mockPlayerInstance()]);
        const mockPlayerData = mockPlayer('room-1');

        const instance = plainToInstance(UpdatedPlayers, plain);

        expect(instance).toBeInstanceOf(UpdatedPlayers);
        expect(Array.isArray(instance.players)).toBe(true);
        expect(instance.players[0]).toBeInstanceOf(Player);
        expect(instance.players[0].id).toBe(mockPlayerData.id);
        expect(instance.players[0].user).toEqual(mockPlayerData.user);
        expect(instance.players[0].roomId).toBe('room-1');
        expect(instance.players[0].online).toBe(true);
        expect(instance.players[0].role).toBe('player');
    });

    it('should transform snake_case fields to camelCase properties in Player', () => {
        const player = {
            id: 2,
            room_id: 'snake-room',
            online: 1,
            role: 'owner'
        };
        // @ts-expect-error: Using snake_case for testing transformation
        const plain = newPlainObject([player]);

        const instance = plainToInstance(UpdatedPlayers, plain);

        expect(instance.players[0].id).toBe(2);
        expect(instance.players[0].roomId).toBe('snake-room');
        expect(instance.players[0].online).toBe(true);
        expect(instance.players[0].role).toBe('owner');
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = newPlainObject([mockPlayerInstance()]);

        const instance = plainToInstance(UpdatedPlayers, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if players is not a valid Player array', async () => {
        const player = { id: 'not-a-number' };
        // @ts-expect-error: Using invalid player for testing validation
        const plain = newPlainObject([player]);

        const instance = plainToInstance(UpdatedPlayers, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'players')).toBe(true);
    });
});

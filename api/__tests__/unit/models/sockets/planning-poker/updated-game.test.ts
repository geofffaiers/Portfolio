import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdatedGame } from '@src/models/sockets/planning-poker';
import { Game } from '@src/models/planning-poker/game';
import { MessageType } from '@src/models';
import { mockGame } from '@mocks/models/planning-poker/game';

const mockGameInstance = (): Game => {
    return plainToInstance(Game, mockGame('room-1'));
};

const newPlainObject = (game?: Game) => {
    return {
        type: MessageType.UPDATED_GAME,
        game
    };
};

describe('UpdatedGame model', () => {
    it('should transform plain object to UpdatedGame instance with nested Game', () => {
        const plain = newPlainObject(mockGameInstance());

        const instance = plainToInstance(UpdatedGame, plain);

        expect(instance).toBeInstanceOf(UpdatedGame);
        expect(instance.game).toBeInstanceOf(Game);
        expect(instance.game.id).toBe(mockGame('room-1').id);
    });

    it('should transform snake_case fields to camelCase properties in Game', () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const game = {
            id: 2,
            room_id: 'snake-room',
            name: 'Snake Game',
            in_progress: false,
            created_at: now,
            updated_at: now,
            rounds: []
        };
        // @ts-expect-error: Using snake_case for testing transformation
        const plain = newPlainObject(game);

        const instance = plainToInstance(UpdatedGame, plain);

        expect(instance.game.id).toBe(2);
        expect(instance.game.roomId).toBe('snake-room');
        expect(instance.game.name).toBe('Snake Game');
        expect(instance.game.inProgress).toBe(false);
        expect(instance.game.createdAt).toEqual(now);
        expect(instance.game.updatedAt).toEqual(now);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = newPlainObject(mockGameInstance());

        const instance = plainToInstance(UpdatedGame, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if game is not a valid Game', async () => {
        const game = { id: 'not-a-number' };
        // @ts-expect-error: Using invalid game for testing validation
        const plain = newPlainObject(game);

        const instance = plainToInstance(UpdatedGame, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'game')).toBe(true);
    });
});

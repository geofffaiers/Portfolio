import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Game } from '@src/models/planning-poker/game';
import { Round } from '@src/models/planning-poker/round';
import { mockGame, mockGameAlt } from '@mocks/models/planning-poker/game';
import { mockRound } from '@mocks/models/planning-poker/round';

describe('Game model', () => {
    it('should transform plain object to Game instance with nested Rounds', () => {
        const plain = mockGame('room-1');

        const instance = plainToInstance(Game, plain);

        expect(instance).toBeInstanceOf(Game);

        expect(instance.id).toBe(plain.id);
        expect(instance.roomId).toBe(plain.roomId);
        expect(instance.name).toBe(plain.name);
        expect(instance.inProgress).toBe(plain.inProgress);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.updatedAt).toEqual(plain.updatedAt);
        expect(instance.rounds.length).toBe(plain.rounds.length);
        expect(instance.rounds[0]).toBeInstanceOf(Round);
    });

    it('should transform snake_case fields to camelCase properties', () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const round = mockRound('snake-room', 1);
        const plain = {
            id: 2,
            room_id: 'snake-room',
            name: 'Snake Game',
            in_progress: 1,
            created_at: now,
            updated_at: now,
            rounds: [round]
        };

        const instance = plainToInstance(Game, plain);

        expect(instance.roomId).toBe('snake-room');
        expect(instance.inProgress).toBe(true);
        expect(instance.createdAt).toEqual(now);
        expect(instance.updatedAt).toEqual(now);
        expect(instance.rounds[0]).toBeInstanceOf(Round);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = mockGameAlt('room-2');

        const instance = plainToInstance(Game, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should validate successfully with empty rounds array', async () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const plain = {
            id: 4,
            roomId: 'room-4',
            name: 'No Rounds Game',
            inProgress: false,
            createdAt: now,
            updatedAt: now,
            rounds: []
        };

        const instance = plainToInstance(Game, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', async () => {
        const plain = {
            name: 'Missing Fields'
        };

        const instance = plainToInstance(Game, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('roomId');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
        expect(properties).toContain('rounds');
    });

    it('should fail validation if types are incorrect', async () => {
        const plain = {
            id: 'not-a-number',
            roomId: 123,
            name: 456,
            inProgress: 'not-a-boolean',
            createdAt: 'not-a-date',
            updatedAt: 'not-a-date',
            rounds: 'not-an-array'
        };

        const instance = plainToInstance(Game, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('roomId');
        expect(properties).toContain('name');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
        expect(properties).toContain('rounds');
    });
});
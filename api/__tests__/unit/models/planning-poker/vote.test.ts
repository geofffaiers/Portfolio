import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Vote } from '@src/models/planning-poker/vote';
import { mockVote, mockVoteAlt } from '@mocks/models/planning-poker/vote';

describe('Vote model', () => {
    it('should transform plain object to Vote instance with all fields', async () => {
        const plain = mockVote('room-1', 1);

        const instance = plainToInstance(Vote, plain);

        expect(instance).toBeInstanceOf(Vote);

        expect(instance.id).toBe(plain.id);
        expect(instance.roomId).toBe(plain.roomId);
        expect(instance.roundId).toBe(plain.roundId);
        expect(instance.playerId).toBe(plain.playerId);
        expect(instance.value).toBe(plain.value);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.updatedAt).toEqual(plain.updatedAt);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should transform plain object to Vote instance with alternate mock data', async () => {
        const plain = mockVoteAlt('room-2', 2);

        const instance = plainToInstance(Vote, plain);

        expect(instance).toBeInstanceOf(Vote);

        expect(instance.id).toBe(plain.id);
        expect(instance.roomId).toBe(plain.roomId);
        expect(instance.roundId).toBe(plain.roundId);
        expect(instance.playerId).toBe(plain.playerId);
        expect(instance.value).toBe(plain.value);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.updatedAt).toEqual(plain.updatedAt);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should transform snake_case fields to camelCase properties', async () => {
        const now = new Date('2024-03-01T10:00:00Z');
        const plain = {
            id: 3,
            room_id: 'snake-room',
            round_id: 3,
            player_id: 303,
            value: '13',
            created_at: now,
            updated_at: now
        };

        const instance = plainToInstance(Vote, plain);

        expect(instance.roomId).toBe('snake-room');
        expect(instance.roundId).toBe(3);
        expect(instance.playerId).toBe(303);
        expect(instance.value).toBe('13');
        expect(instance.createdAt).toEqual(now);
        expect(instance.updatedAt).toEqual(now);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = {
            id: 4,
            roomId: 'room-4',
            roundId: 4,
            userId: 404,
            value: '21',
            createdAt: new Date('2024-04-01T10:00:00Z'),
            updatedAt: new Date('2024-04-01T11:00:00Z')
        };

        const instance = plainToInstance(Vote, plain);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should validate successfully with optional value field undefined', async () => {
        const plain = {
            id: 5,
            roomId: 'room-5',
            roundId: 5,
            userId: 505,
            createdAt: new Date('2024-05-01T10:00:00Z'),
            updatedAt: new Date('2024-05-01T11:00:00Z')
        };

        const instance = plainToInstance(Vote, plain);

        expect(instance.value).toBeUndefined();

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', async () => {
        const plain = {
            value: 'missing'
        };

        const instance = plainToInstance(Vote, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('roomId');
        expect(properties).toContain('roundId');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
    });

    it('should fail validation if types are incorrect', async () => {
        const plain = {
            id: 'not-a-number',
            roomId: 123,
            roundId: 'not-a-number',
            value: 42,
            createdAt: 'not-a-date',
            updatedAt: 'not-a-date'
        };

        const instance = plainToInstance(Vote, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('roomId');
        expect(properties).toContain('roundId');
        expect(properties).toContain('value');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
    });
});

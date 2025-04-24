import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Room } from '@src/models/planning-poker/room';
import { Player } from '@src/models/planning-poker/player';
import { Game } from '@src/models/planning-poker/game';
import { mockRoom, mockRoomAlt } from '@mocks/models/planning-poker/room';

describe('Room model', () => {
    it('should transform plain object to Room instance with nested Players and Games', async () => {
        const plain = mockRoom();

        const instance = plainToInstance(Room, plain);

        expect(instance).toBeInstanceOf(Room);
        expect(instance.id).toBe(plain.id);
        expect(instance.name).toBe(plain.name);
        expect(instance.description).toBe(plain.description);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.updatedAt).toEqual(plain.updatedAt);
        expect(Array.isArray(instance.players)).toBe(true);
        expect(instance.players.length).toBe(plain.players.length);
        expect(instance.players[0]).toBeInstanceOf(Player);
        expect(Array.isArray(instance.games)).toBe(true);
        expect(instance.games.length).toBe(plain.games.length);
        expect(instance.games[0]).toBeInstanceOf(Game);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should transform plain object to Room instance with alternate mock data', async () => {
        const plain = mockRoomAlt();

        const instance = plainToInstance(Room, plain);

        expect(instance).toBeInstanceOf(Room);
        expect(instance.id).toBe(plain.id);
        expect(instance.name).toBe(plain.name);
        expect(instance.description).toBe(plain.description);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.updatedAt).toEqual(plain.updatedAt);
        expect(Array.isArray(instance.players)).toBe(true);
        expect(instance.players.length).toBe(plain.players.length);
        expect(instance.players[0]).toBeInstanceOf(Player);
        expect(Array.isArray(instance.games)).toBe(true);
        expect(instance.games.length).toBe(plain.games.length);
        expect(instance.games[0]).toBeInstanceOf(Game);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should transform snake_case fields to camelCase properties', async () => {
        const now = new Date('2024-03-01T09:00:00Z');
        const plain = {
            id: 'snake-room',
            name: 'Snake Room',
            description: 'Room with snake_case fields',
            players: [],
            created_at: now,
            updated_at: now,
            games: []
        };

        const instance = plainToInstance(Room, plain);

        expect(instance.id).toBe('snake-room');
        expect(instance.createdAt).toEqual(now);
        expect(instance.updatedAt).toEqual(now);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = {
            id: 'room-3',
            name: 'Valid Room',
            description: 'A valid room',
            players: [],
            createdAt: new Date('2024-04-01T09:00:00Z'),
            updatedAt: new Date('2024-04-01T12:00:00Z'),
            games: []
        };

        const instance = plainToInstance(Room, plain);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', async () => {
        const plain = {
            name: 'Missing Fields'
        };

        const instance = plainToInstance(Room, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('description');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
        expect(properties).toContain('games');
    });

    it('should fail validation if types are incorrect', async () => {
        const plain = {
            id: 123,
            name: 456,
            description: 789,
            players: 'not-an-array',
            createdAt: 'not-a-date',
            updatedAt: 'not-a-date',
            games: 'not-an-array'
        };

        const instance = plainToInstance(Room, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('name');
        expect(properties).toContain('description');
        expect(properties).toContain('players');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
        expect(properties).toContain('games');
    });
});

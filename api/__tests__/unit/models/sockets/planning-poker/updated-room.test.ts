import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdatedRoom } from '@src/models/sockets/planning-poker';
import { Room } from '@src/models/planning-poker/room';
import { MessageType } from '@src/models';
import { mockRoom } from '@mocks/models/planning-poker/room';

const mockRoomInstance = (): Room => {
    return plainToInstance(Room, mockRoom());
};

const newPlainObject = (room?: Room) => {
    return {
        type: MessageType.UPDATED_ROOM,
        room
    };
};

describe('UpdatedRoom model', () => {
    it('should transform plain object to UpdatedRoom instance with nested Room', () => {
        const plain = newPlainObject(mockRoomInstance());

        const instance = plainToInstance(UpdatedRoom, plain);

        expect(instance).toBeInstanceOf(UpdatedRoom);
        expect(instance.room).toBeInstanceOf(Room);
        expect(instance.room.id).toBe(mockRoom().id);
        expect(instance.room.name).toBe(mockRoom().name);
        expect(instance.room.description).toBe(mockRoom().description);
    });

    it('should transform snake_case fields to camelCase properties in Room', () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const room = {
            id: 'snake-room',
            name: 'Snake Room',
            description: 'A room for snakes',
            created_at: now,
            updated_at: now,
            players: [],
            games: []
        };
        // @ts-expect-error: Using snake_case for testing transformation
        const plain = newPlainObject(room);

        const instance = plainToInstance(UpdatedRoom, plain);

        expect(instance.room.id).toBe('snake-room');
        expect(instance.room.name).toBe('Snake Room');
        expect(instance.room.description).toBe('A room for snakes');
        expect(instance.room.createdAt).toEqual(now);
        expect(instance.room.updatedAt).toEqual(now);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = newPlainObject(mockRoomInstance());

        const instance = plainToInstance(UpdatedRoom, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if room is not a valid Room', async () => {
        const room = { id: 123 };
        // @ts-expect-error: Using invalid room for testing validation
        const plain = newPlainObject(room);

        const instance = plainToInstance(UpdatedRoom, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'room')).toBe(true);
    });
});

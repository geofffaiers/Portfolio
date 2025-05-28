import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdatedProfile } from '@src/models/sockets/profile/updated-profile';
import { User } from '@src/models/user';
import { MessageType } from '@src/models';
import { mockUser1 } from '@mocks/models/user';

describe('UpdatedProfile model', () => {
    const mockUserInstance = (): User => {
        return plainToInstance(User, mockUser1());
    };

    const newPlainObject = (user?: User) => {
        return {
            type: MessageType.UPDATED_PROFILE,
            user
        };
    };

    it('should transform plain object to UpdatedProfile instance with nested User', () => {
        const plain = newPlainObject(mockUserInstance());

        const instance = plainToInstance(UpdatedProfile, plain);

        expect(instance).toBeInstanceOf(UpdatedProfile);
        expect(instance.user).toBeInstanceOf(User);
        expect(instance.user.id).toBe(mockUser1().id);
        expect(instance.user.username).toBe(mockUser1().username);
    });

    it('should transform snake_case fields to camelCase properties in User', () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const user = {
            id: 2,
            username: 'snake-user',
            first_name: 'Snake',
            last_name: 'User',
            last_login: now
        };
        // @ts-expect-error: Using snake_case for testing transformation
        const plain = newPlainObject(user);

        const instance = plainToInstance(UpdatedProfile, plain);

        expect(instance.user.id).toBe(2);
        expect(instance.user.username).toBe('snake-user');
        expect(instance.user.firstName).toBe('Snake');
        expect(instance.user.lastName).toBe('User');
        expect(instance.user.lastLogin).toEqual(now);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = newPlainObject(mockUserInstance());

        const instance = plainToInstance(UpdatedProfile, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if user is not a valid User', async () => {
        const user = { id: 'not-a-number' };
        // @ts-expect-error: Using invalid user for testing validation
        const plain = newPlainObject(user);

        const instance = plainToInstance(UpdatedProfile, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'user')).toBe(true);
    });
});

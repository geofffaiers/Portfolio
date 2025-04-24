import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from '@src/models/user';
import { mockUser1, mockUser2 } from '@mocks/models/user';

describe('User model', () => {
    it('should transform plain object to User instance with all fields', () => {
        const plain = mockUser1();

        const instance = plainToInstance(User, plain);

        expect(instance).toBeInstanceOf(User);
        expect(instance.id).toBe(plain.id);
        expect(instance.username).toBe(plain.username);
        expect(instance.password).toBe(plain.password);
        expect(instance.email).toBe(plain.email);
        expect(instance.firstName).toBe(plain.firstName);
        expect(instance.lastName).toBe(plain.lastName);
        expect(instance.lastLogin).toEqual(plain.lastLogin);
        expect(instance.active).toBe(plain.active);
        expect(instance.profilePicture).toBe(plain.profilePicture);
        expect(instance.resetToken).toBe(plain.resetToken);
        expect(instance.resetTokenExpires).toEqual(plain.resetTokenExpires);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.updatedAt).toEqual(plain.updatedAt);
        expect(instance.verifiedEmail).toBe(plain.verifiedEmail);
        expect(instance.validateToken).toBe(plain.validateToken);
        expect(instance.validateTokenExpires).toEqual(plain.validateTokenExpires);
    });

    it('should transform snake_case fields to camelCase properties', () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const plain = {
            id: 2,
            username: 'snake_case',
            password: 'pass',
            email: 'snake@example.com',
            first_name: 'Snake',
            last_name: 'Case',
            last_login: now,
            active: 1,
            profile_picture: 'snake.png',
            reset_token: 'reset123',
            reset_token_expires: now,
            created_at: now,
            updated_at: now,
            verified_email: 1,
            validate_token: 'validate123',
            validate_token_expires: now
        };

        const instance = plainToInstance(User, plain);

        expect(instance.firstName).toBe('Snake');
        expect(instance.lastName).toBe('Case');
        expect(instance.lastLogin).toEqual(now);
        expect(instance.active).toBe(true);
        expect(instance.profilePicture).toBe('snake.png');
        expect(instance.resetToken).toBe('reset123');
        expect(instance.resetTokenExpires).toEqual(now);
        expect(instance.createdAt).toEqual(now);
        expect(instance.updatedAt).toEqual(now);
        expect(instance.verifiedEmail).toBe(true);
        expect(instance.validateToken).toBe('validate123');
        expect(instance.validateTokenExpires).toEqual(now);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = mockUser2();

        const instance = plainToInstance(User, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should validate successfully with only required fields', async () => {
        const plain = {
            id: 3,
            username: 'requiredonly',
            password: 'pass',
            email: 'required@example.com',
            active: false,
            verifiedEmail: false
        };

        const instance = plainToInstance(User, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', async () => {
        const plain = {
            email: 'missing@example.com'
        };

        const instance = plainToInstance(User, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('username');
        expect(properties).toContain('password');
    });

    it('should fail validation if types are incorrect', async () => {
        const plain = {
            id: 'not-a-number',
            username: 123,
            password: 456,
            email: 789,
            firstName: 101112,
            lastName: 131415,
            lastLogin: 'not-a-date',
            active: 'not-a-boolean',
            profilePicture: 161718,
            resetToken: 192021,
            resetTokenExpires: 'not-a-date',
            createdAt: 'not-a-date',
            updatedAt: 'not-a-date',
            verifiedEmail: 'not-a-boolean',
            validateToken: 222324,
            validateTokenExpires: 'not-a-date'
        };

        const instance = plainToInstance(User, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('username');
        expect(properties).toContain('password');
        expect(properties).toContain('email');
        expect(properties).toContain('firstName');
        expect(properties).toContain('lastName');
        expect(properties).toContain('lastLogin');
        expect(properties).toContain('profilePicture');
        expect(properties).toContain('resetToken');
        expect(properties).toContain('resetTokenExpires');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
        expect(properties).toContain('validateToken');
        expect(properties).toContain('validateTokenExpires');
    });
});

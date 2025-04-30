import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Session } from '@src/models/session';
import { mockSession, mockSessionAlt } from '@mocks/models/session';

describe('Session model', () => {
    it('should transform plain object to Session instance with all fields', () => {
        const plain = mockSession();

        const instance = plainToInstance(Session, plain);

        expect(instance).toBeInstanceOf(Session);

        expect(instance.id).toBe(plain.id);
        expect(instance.userId).toBe(plain.userId);
        expect(instance.refreshToken).toBe(plain.refreshToken);
        expect(instance.userAgent).toBe(plain.userAgent);
        expect(instance.ipAddress).toBe(plain.ipAddress);
        expect(instance.location).toBe(plain.location);
        expect(instance.isActive).toBe(plain.isActive);
        expect(instance.thisSession).toBe(plain.thisSession);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.updatedAt).toEqual(plain.updatedAt);
        expect(instance.expiresAt).toEqual(plain.expiresAt);
    });

    it('should transform snake_case fields to camelCase properties', () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const plain = {
            id: 10,
            user_id: 20,
            refresh_token: 'snake-refresh',
            user_agent: 'SnakeAgent',
            ip_address: '10.0.0.1',
            location: 'Snakeville',
            is_active: 1,
            thisSession: true,
            created_at: now,
            updated_at: now,
            expires_at: now
        };

        const instance = plainToInstance(Session, plain);

        expect(instance.userId).toBe(20);
        expect(instance.refreshToken).toBe('snake-refresh');
        expect(instance.userAgent).toBe('SnakeAgent');
        expect(instance.ipAddress).toBe('10.0.0.1');
        expect(instance.location).toBe('Snakeville');
        expect(instance.isActive).toBe(true);
        expect(instance.createdAt).toEqual(now);
        expect(instance.updatedAt).toEqual(now);
        expect(instance.expiresAt).toEqual(now);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = mockSessionAlt();

        const instance = plainToInstance(Session, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', async () => {
        const plain = {
            refreshToken: 'missing-required'
        };

        const instance = plainToInstance(Session, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('userAgent');
        expect(properties).toContain('ipAddress');
        expect(properties).toContain('thisSession');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
        expect(properties).toContain('expiresAt');
    });

    it('should fail validation if types are incorrect', async () => {
        const plain = {
            id: null,
            userId: null,
            refreshToken: null,
            userAgent: 456,
            ipAddress: 789,
            location: 101112,
            isActive: 'not-a-boolean',
            thisSession: 'not-a-boolean',
            createdAt: 'not-a-date',
            updatedAt: 'not-a-date',
            expiresAt: 'not-a-date'
        };

        const instance = plainToInstance(Session, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('userAgent');
        expect(properties).toContain('ipAddress');
        expect(properties).toContain('location');
        expect(properties).toContain('thisSession');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
        expect(properties).toContain('expiresAt');
    });
});

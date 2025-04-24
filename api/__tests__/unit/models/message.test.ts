import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Message } from '@src/models/message';
import { mockSentMessage, mockReceivedMessage } from '@mocks/models/message';

describe('Message model', () => {
    it('should transform plain object to Message instance with all fields', () => {
        const plain = mockSentMessage();

        const instance = plainToInstance(Message, plain);

        expect(instance).toBeInstanceOf(Message);
        expect(instance.id).toBe(plain.id);
        expect(instance.senderId).toBe(plain.senderId);
        expect(instance.receiverId).toBe(plain.receiverId);
        expect(instance.content).toBe(plain.content);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.readAt).toEqual(plain.readAt);
    });

    it('should transform snake_case fields to camelCase properties', () => {
        const plain = {
            id: 10,
            sender_id: 20,
            receiver_id: 30,
            content: 'Snake',
            created_at: new Date('2024-01-01T10:00:00Z'),
            read_at: new Date('2024-01-01T10:05:00Z')
        };

        const instance = plainToInstance(Message, plain);

        expect(instance.senderId).toBe(20);
        expect(instance.receiverId).toBe(30);
        expect(instance.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'));
        expect(instance.readAt).toEqual(new Date('2024-01-01T10:05:00Z'));
    });

    it('should validate successfully with all required fields', async () => {
        const plain = mockSentMessage();

        const instance = plainToInstance(Message, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should validate successfully with optional fields omitted', async () => {
        const plain = {
            id: 1,
            senderId: 2,
            receiverId: 3,
            content: 'Test'
        };

        const instance = plainToInstance(Message, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', async () => {
        const plain = {
            content: 'Missing ids'
        };

        const instance = plainToInstance(Message, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('senderId');
        expect(properties).toContain('receiverId');
    });

    it('should fail validation if types are incorrect', async () => {
        const plain = {
            id: 'not-a-number',
            senderId: 'not-a-number',
            receiverId: 'not-a-number',
            content: 123,
            createdAt: 'not-a-date',
            readAt: 'not-a-date'
        };

        const instance = plainToInstance(Message, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('senderId');
        expect(properties).toContain('receiverId');
        expect(properties).toContain('content');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('readAt');
    });

    it('should transform and validate a received message', async () => {
        const plain = mockReceivedMessage();

        const instance = plainToInstance(Message, plain);

        expect(instance).toBeInstanceOf(Message);
        expect(instance.senderId).toBe(plain.senderId);
        expect(instance.receiverId).toBe(plain.receiverId);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });
});

import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdatedMessage } from '@src/models/sockets/messaging';
import { Message } from '@src/models/message';
import { mockSentMessage } from '@mocks/models/message';
import { MessageType } from '@src/models';

const mockMessage = (): Message => {
    return plainToInstance(Message, mockSentMessage());
};

const newPlainObject = (message?: Message) => {
    return {
        type: MessageType.UPDATED_MESSAGE,
        message
    };
};

describe('UpdatedMessage model', () => {
    it('should transform plain object to UpdatedMessage instance with nested Message', () => {
        const plain = newPlainObject(mockMessage());

        const instance = plainToInstance(UpdatedMessage, plain);

        expect(instance).toBeInstanceOf(UpdatedMessage);
        expect(instance.message).toBeInstanceOf(Message);
        expect(instance.message.id).toBe(1);
        expect(instance.message.content).toBe('Sent Message');
    });

    it('should transform snake_case fields to camelCase properties in Message', () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const message = {
            id: 2,
            sender_id: 3,
            receiver_id: 4,
            content: 'Snake',
            created_at: now,
            read_at: now
        };
        // @ts-expect-error: Using snake_case for testing transformation
        const plain = newPlainObject(message);

        const instance = plainToInstance(UpdatedMessage, plain);

        expect(instance.message.id).toBe(2);
        expect(instance.message.senderId).toBe(3);
        expect(instance.message.receiverId).toBe(4);
        expect(instance.message.content).toBe('Snake');
        expect(instance.message.createdAt).toEqual(now);
        expect(instance.message.readAt).toEqual(now);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = newPlainObject(mockMessage());

        const instance = plainToInstance(UpdatedMessage, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if message is not a valid Message', async () => {
        const message = { id: 'not-a-number' };
        // @ts-expect-error: Using invalid message for testing validation
        const plain = newPlainObject(message);

        const instance = plainToInstance(UpdatedMessage, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'message')).toBe(true);
    });
});

import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ReadMessage } from '@src/models/sockets/messaging';
import { MessageType } from '@src/models';

const newPlainObject = (messageId?: number) => {
    return {
        type: MessageType.READ_MESSAGE,
        messageId
    };
};

describe('ReadMessage model', () => {
    it('should transform plain object to ReadMessage instance', () => {
        const plain = newPlainObject(42);

        const instance = plainToInstance(ReadMessage, plain);

        expect(instance).toBeInstanceOf(ReadMessage);
        expect(instance.messageId).toBe(42);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = newPlainObject(123);

        const instance = plainToInstance(ReadMessage, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if messageId is missing', async () => {
        const plain = { type: MessageType.READ_MESSAGE };

        const instance = plainToInstance(ReadMessage, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('messageId');
    });

    it('should fail validation if messageId is not a number', async () => {
        const plain = newPlainObject('not-a-number' as unknown as number);

        const instance = plainToInstance(ReadMessage, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'messageId')).toBe(true);
    });
});

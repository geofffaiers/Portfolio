import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ErrorMessage } from '@src/models/sockets/error-message';
import { MessageType } from '@src/models';

describe('ErrorMessage model', () => {
    it('should transform plain object to ErrorMessage instance with message', () => {
        const plain = { type: MessageType.ERROR, message: 'Something went wrong' };

        const instance = plainToInstance(ErrorMessage, plain);

        expect(instance).toBeInstanceOf(ErrorMessage);
        expect(instance.type).toBe(MessageType.ERROR);
        expect(instance.message).toBe('Something went wrong');
    });

    it('should transform snake_case fields to camelCase properties', () => {
        const plain = { type: MessageType.ERROR, message: 'snake_case error' };

        const instance = plainToInstance(ErrorMessage, plain);

        expect(instance.message).toBe('snake_case error');
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = { type: MessageType.ERROR, message: 'Valid error' };

        const instance = plainToInstance(ErrorMessage, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if message is missing', async () => {
        const plain = { type: MessageType.ERROR };

        const instance = plainToInstance(ErrorMessage, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('message');
    });

    it('should fail validation if message is not a string', async () => {
        const plain = { type: MessageType.ERROR, message: 123 };

        const instance = plainToInstance(ErrorMessage, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'message')).toBe(true);
    });

    it('should fail validation if type is missing or invalid', async () => {
        const plain = { message: 'Missing type' };
        const instance = plainToInstance(ErrorMessage, plain);
        const errors = await validate(instance);
        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('type');

        const invalid = { type: 'not-a-type', message: 'Invalid type' };
        const invalidInstance = plainToInstance(ErrorMessage, invalid);
        const invalidErrors = await validate(invalidInstance);
        expect(invalidErrors.length).toBeGreaterThan(0);
        expect(invalidErrors.some(e => e.property === 'type')).toBe(true);
    });
});

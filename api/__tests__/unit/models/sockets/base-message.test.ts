import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BaseMessage } from '@src/models/sockets/base-message';
import { MessageType } from '@src/models';

describe('BaseMessage model', () => {
    it('should transform plain object to BaseMessage instance', () => {
        const plain = { type: MessageType.ERROR };

        const instance = plainToInstance(BaseMessage, plain);

        expect(instance).toBeInstanceOf(BaseMessage);
        expect(instance.type).toBe(MessageType.ERROR);
    });

    it('should validate successfully with correct type', async () => {
        const plain = { type: MessageType.ERROR };

        const instance = plainToInstance(BaseMessage, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if type is missing', async () => {
        const plain = {};
        const instance = plainToInstance(BaseMessage, plain);
        const errors = await validate(instance);
        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('type');
    });

    it('should fail validation if type is not a valid MessageType', async () => {
        const plain = { type: 'not-a-valid-type' };
        const instance = plainToInstance(BaseMessage, plain);
        const errors = await validate(instance);
        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('type');
    });
});

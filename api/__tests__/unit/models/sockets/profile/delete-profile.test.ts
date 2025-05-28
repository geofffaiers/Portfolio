import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DeleteProfile } from '@src/models/sockets/profile/delete-profile';
import { MessageType } from '@src/models';

describe('DeleteProfile model', () => {
    it('should transform plain object to DeleteProfile instance', () => {
        const plain = { type: MessageType.DELETE_PROFILE };

        const instance = plainToInstance(DeleteProfile, plain);

        expect(instance).toBeInstanceOf(DeleteProfile);
        expect(instance.type).toBe(MessageType.DELETE_PROFILE);
    });

    it('should validate successfully with correct type', async () => {
        const plain = { type: MessageType.DELETE_PROFILE };

        const instance = plainToInstance(DeleteProfile, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if type is missing or invalid', async () => {
        const plain = {};
        const instance = plainToInstance(DeleteProfile, plain);
        const errors = await validate(instance);
        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('type');
    });
});

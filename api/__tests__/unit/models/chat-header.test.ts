import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ChatHeader } from '@src/models/chat-header';
import { User } from '@src/models/user';
import { Message } from '@src/models/message';
import { mockReceivedMessage, mockSentMessage, mockUser1 } from '@mocks/models';

const user = mockUser1();
const sentMessage = mockSentMessage();
const receivedMessage = mockReceivedMessage();

describe('ChatHeader model', () => {
    it('should transform plain object to ChatHeader instance with nested User and Message', () => {
        const plain = {
            user,
            lastMessage: sentMessage,
            lastReceivedMessage: receivedMessage
        };

        const instance = plainToInstance(ChatHeader, plain);

        expect(instance).toBeInstanceOf(ChatHeader);

        expect(instance.user).toBeInstanceOf(User);
        expect(instance.lastMessage).toBeInstanceOf(Message);
        expect(instance.lastReceivedMessage).toBeInstanceOf(Message);
    });

    it('should validate successfully when required and optional fields are present', async () => {
        const plain = {
            user,
            lastMessage: sentMessage,
            lastReceivedMessage: receivedMessage
        };

        const instance = plainToInstance(ChatHeader, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should validate successfully when only required user field is present', async () => {
        const plain = {
            user
        };

        const instance = plainToInstance(ChatHeader, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if user is incorrect', async () => {
        const plain = {
            user: null,
            lastMessage: sentMessage
        };

        const instance = plainToInstance(ChatHeader, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('user');
    });

    it('should transform and validate with undefined optional fields', async () => {
        const plain = {
            user,
            lastMessage: undefined,
            lastReceivedMessage: undefined
        };

        const instance = plainToInstance(ChatHeader, plain);

        expect(instance.lastMessage).toBeUndefined();
        expect(instance.lastReceivedMessage).toBeUndefined();

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });
});

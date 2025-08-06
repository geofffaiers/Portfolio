import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SubmitScore } from '@src/models/sockets/planning-poker';
import { Vote } from '@src/models/planning-poker/vote';
import { MessageType } from '@src/models';
import { mockVote } from '@mocks/models/planning-poker/vote';

const mockVoteInstance = (): Vote => {
    return plainToInstance(Vote, mockVote('room-1', 10));
};

const newPlainObject = (vote?: Vote) => {
    return {
        type: MessageType.SUBMIT_SCORE,
        vote
    };
};

describe('SubmitScore model', () => {
    it('should transform plain object to SubmitScore instance with nested Vote', () => {
        const plain = newPlainObject(mockVoteInstance());

        const instance = plainToInstance(SubmitScore, plain);

        expect(instance).toBeInstanceOf(SubmitScore);
        expect(instance.vote).toBeInstanceOf(Vote);
        expect(instance.vote.id).toBe(1);
        expect(instance.vote.roomId).toBe('room-1');
        expect(instance.vote.roundId).toBe(10);
        expect(instance.vote.playerId).toBe(101);
        expect(instance.vote.value).toBe('5');
    });

    it('should transform snake_case fields to camelCase properties in Vote', () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const vote = {
            id: 2,
            room_id: 'snake-room',
            round_id: 3,
            player_id: 4,
            value: '8',
            created_at: now,
            updated_at: now
        };
        // @ts-expect-error: Using snake_case for testing transformation
        const plain = newPlainObject(vote);

        const instance = plainToInstance(SubmitScore, plain);

        expect(instance.vote.id).toBe(2);
        expect(instance.vote.roomId).toBe('snake-room');
        expect(instance.vote.roundId).toBe(3);
        expect(instance.vote.playerId).toBe(4);
        expect(instance.vote.value).toBe('8');
        expect(instance.vote.createdAt).toEqual(now);
        expect(instance.vote.updatedAt).toEqual(now);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = newPlainObject(mockVoteInstance());

        const instance = plainToInstance(SubmitScore, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if vote is not a valid Vote', async () => {
        const vote = { id: 'not-a-number' };
        // @ts-expect-error: Using invalid vote for testing validation
        const plain = newPlainObject(vote);

        const instance = plainToInstance(SubmitScore, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'vote')).toBe(true);
    });
});

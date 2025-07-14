import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdatedRound } from '@src/models/sockets/planning-poker';
import { Round } from '@src/models/planning-poker/round';
import { MessageType } from '@src/models';
import { mockRound } from '@mocks/models/planning-poker/round';

const mockRoundInstance = (): Round => {
    return plainToInstance(Round, mockRound('room-1', 1));
};

const newPlainObject = (round?: Round) => {
    return {
        type: MessageType.UPDATED_ROUND,
        round
    };
};

describe('UpdatedRound model', () => {
    it('should transform plain object to UpdatedRound instance with nested Round', () => {
        const plain = newPlainObject(mockRoundInstance());

        const instance = plainToInstance(UpdatedRound, plain);

        expect(instance).toBeInstanceOf(UpdatedRound);
        expect(instance.round).toBeInstanceOf(Round);
        expect(instance.round.id).toBe(mockRound('room-1', 1).id);
    });

    it('should transform snake_case fields to camelCase properties in Round', () => {
        const now = new Date('2024-01-01T10:00:00Z');
        const round = {
            id: 2,
            room_id: 'snake-room',
            game_id: 3,
            in_progress: true,
            round_success: false,
            total_score: '42.5',
            median_score: '21.25',
            mean_score: '30.5',
            mode_score: '15',
            lowest_score: '10',
            highest_score: '50',
            count_of_different_scores: 3,
            final_estimate: '25',
            ended_at: now,
            created_at: now,
            updated_at: now,
            votes: []
        };
        // @ts-expect-error: Using snake_case for testing transformation
        const plain = newPlainObject(round);

        const instance = plainToInstance(UpdatedRound, plain);

        expect(instance.round.id).toBe(2);
        expect(instance.round.roomId).toBe('snake-room');
        expect(instance.round.gameId).toBe(3);
        expect(instance.round.inProgress).toBe(true);
        expect(instance.round.roundSuccess).toBe(false);
        expect(instance.round.totalScore).toBe('42.5');
        expect(instance.round.medianScore).toBe('21.25');
        expect(instance.round.meanScore).toBe('30.5');
        expect(instance.round.modeScore).toBe('15');
        expect(instance.round.lowestScore).toBe('10');
        expect(instance.round.highestScore).toBe('50');
        expect(instance.round.countOfDifferentScores).toBe(3);
        expect(instance.round.finalEstimate).toBe('25');
        expect(instance.round.endedAt).toEqual(now);
        expect(instance.round.createdAt).toEqual(now);
        expect(instance.round.updatedAt).toEqual(now);
        expect(instance.round.votes).toEqual([]);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = newPlainObject(mockRoundInstance());

        const instance = plainToInstance(UpdatedRound, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if round is not a valid Round', async () => {
        const round = { id: 'not-a-number' };
        // @ts-expect-error: Using invalid round for testing validation
        const plain = newPlainObject(round);

        const instance = plainToInstance(UpdatedRound, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some(e => e.property === 'round')).toBe(true);
    });
});

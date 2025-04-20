import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Round } from '@src/models/planning-poker/round';
import { Vote } from '@src/models/planning-poker/vote';
import { mockRound, mockRoundAlt } from '@mocks/models/planning-poker/round';

describe('Round model', () => {
    it('should transform plain object to Round instance with all fields', async () => {
        const plain = mockRound('room-1', 1);

        const instance = plainToInstance(Round, plain);

        expect(instance).toBeInstanceOf(Round);

        expect(instance.id).toBe(plain.id);
        expect(instance.roomId).toBe(plain.roomId);
        expect(instance.gameId).toBe(plain.gameId);
        expect(instance.inProgress).toBe(plain.inProgress);
        expect(instance.roundSuccess).toBe(plain.roundSuccess);
        expect(instance.totalScore).toBe(plain.totalScore);
        expect(instance.medianScore).toBe(plain.medianScore);
        expect(instance.meanScore).toBe(plain.meanScore);
        expect(instance.modeScore).toBe(plain.modeScore);
        expect(instance.lowestScore).toBe(plain.lowestScore);
        expect(instance.highestScore).toBe(plain.highestScore);
        expect(instance.countOfDifferentScores).toBe(plain.countOfDifferentScores);
        expect(instance.finalEstimate).toBe(plain.finalEstimate);
        expect(instance.endedAt).toEqual(plain.endedAt);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.updatedAt).toEqual(plain.updatedAt);
        expect(Array.isArray(instance.votes)).toBe(true);
        expect(instance.votes.length).toBe(plain.votes.length);
        expect(instance.votes[0]).toBeInstanceOf(Vote);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should transform plain object to Round instance with alternate mock data', async () => {
        const plain = mockRoundAlt('room-2', 2);

        const instance = plainToInstance(Round, plain);

        expect(instance).toBeInstanceOf(Round);

        expect(instance.id).toBe(plain.id);
        expect(instance.roomId).toBe(plain.roomId);
        expect(instance.gameId).toBe(plain.gameId);
        expect(instance.inProgress).toBe(plain.inProgress);
        expect(instance.roundSuccess).toBe(plain.roundSuccess);
        expect(instance.totalScore).toBe(plain.totalScore);
        expect(instance.medianScore).toBe(plain.medianScore);
        expect(instance.meanScore).toBe(plain.meanScore);
        expect(instance.modeScore).toBe(plain.modeScore);
        expect(instance.lowestScore).toBe(plain.lowestScore);
        expect(instance.highestScore).toBe(plain.highestScore);
        expect(instance.countOfDifferentScores).toBe(plain.countOfDifferentScores);
        expect(instance.finalEstimate).toBe(plain.finalEstimate);
        expect(instance.endedAt).toEqual(plain.endedAt);
        expect(instance.createdAt).toEqual(plain.createdAt);
        expect(instance.updatedAt).toEqual(plain.updatedAt);
        expect(Array.isArray(instance.votes)).toBe(true);
        expect(instance.votes.length).toBe(plain.votes.length);
        expect(instance.votes[0]).toBeInstanceOf(Vote);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should transform snake_case fields to camelCase properties', async () => {
        const now = new Date('2024-03-01T10:00:00Z');
        const plain = {
            id: 3,
            room_id: 'snake-room',
            game_id: 3,
            in_progress: 1,
            round_success: 0,
            total_score: '10.5',
            median_score: '5.25',
            mean_score: '6.5',
            mode_score: '4',
            lowest_score: '2',
            highest_score: '12',
            count_of_different_scores: 2,
            final_estimate: '7',
            ended_at: now,
            created_at: now,
            updated_at: now,
            votes: []
        };

        const instance = plainToInstance(Round, plain);

        expect(instance.roomId).toBe('snake-room');
        expect(instance.gameId).toBe(3);
        expect(instance.inProgress).toBe(true);
        expect(instance.roundSuccess).toBe(false);
        expect(instance.totalScore).toBe('10.5');
        expect(instance.finalEstimate).toBe('7');
        expect(instance.endedAt).toEqual(now);
        expect(instance.createdAt).toEqual(now);
        expect(instance.updatedAt).toEqual(now);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should validate successfully when all required fields are present', async () => {
        const plain = {
            id: 4,
            roomId: 'room-4',
            gameId: 4,
            inProgress: false,
            roundSuccess: false,
            totalScore: '0',
            medianScore: '0',
            meanScore: '0',
            modeScore: '0',
            lowestScore: '0',
            highestScore: '0',
            countOfDifferentScores: 0,
            createdAt: new Date('2024-04-01T10:00:00Z'),
            updatedAt: new Date('2024-04-01T11:00:00Z'),
            votes: []
        };

        const instance = plainToInstance(Round, plain);

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should validate successfully with optional fields undefined', async () => {
        const plain = {
            id: 5,
            roomId: 'room-5',
            gameId: 5,
            inProgress: false,
            roundSuccess: false,
            totalScore: '0',
            medianScore: '0',
            meanScore: '0',
            modeScore: '0',
            lowestScore: '0',
            highestScore: '0',
            countOfDifferentScores: 0,
            finalEstimate: undefined,
            endedAt: undefined,
            createdAt: new Date('2024-05-01T10:00:00Z'),
            updatedAt: new Date('2024-05-01T11:00:00Z'),
            votes: []
        };

        const instance = plainToInstance(Round, plain);

        expect(instance.finalEstimate).toBeUndefined();
        expect(instance.endedAt).toBeUndefined();

        const errors = await validate(instance);

        expect(errors).toEqual([]);
        expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', async () => {
        const plain = {
            id: 6
        };

        const instance = plainToInstance(Round, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('roomId');
        expect(properties).toContain('gameId');
        expect(properties).toContain('totalScore');
        expect(properties).toContain('medianScore');
        expect(properties).toContain('meanScore');
        expect(properties).toContain('modeScore');
        expect(properties).toContain('lowestScore');
        expect(properties).toContain('highestScore');
        expect(properties).toContain('countOfDifferentScores');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
        expect(properties).toContain('votes');
    });

    it('should fail validation if types are incorrect', async () => {
        const plain = {
            id: 'not-a-number',
            roomId: 123,
            gameId: 'not-a-number',
            inProgress: 'not-a-boolean',
            roundSuccess: 'not-a-boolean',
            totalScore: 100,
            medianScore: 50,
            meanScore: 60,
            modeScore: 40,
            lowestScore: 30,
            highestScore: 120,
            countOfDifferentScores: 'not-a-number',
            finalEstimate: 80,
            endedAt: 'not-a-date',
            createdAt: 'not-a-date',
            updatedAt: 'not-a-date',
            votes: 'not-an-array'
        };

        const instance = plainToInstance(Round, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('roomId');
        expect(properties).toContain('gameId');
        expect(properties).toContain('totalScore');
        expect(properties).toContain('medianScore');
        expect(properties).toContain('meanScore');
        expect(properties).toContain('modeScore');
        expect(properties).toContain('lowestScore');
        expect(properties).toContain('highestScore');
        expect(properties).toContain('countOfDifferentScores');
        expect(properties).toContain('finalEstimate');
        expect(properties).toContain('endedAt');
        expect(properties).toContain('createdAt');
        expect(properties).toContain('updatedAt');
        expect(properties).toContain('votes');
    });
});
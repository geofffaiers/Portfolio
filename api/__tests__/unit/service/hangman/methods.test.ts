import axios, { AxiosError } from 'axios';

import { getWordFromDatabase } from '@src/service/hangman/methods';
import { pool } from '@src/helpers/db';
import { FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2';

jest.mock('axios');
jest.mock('@src/helpers/db', () => ({
    pool: {
        query: jest.fn()
    }
}));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockPool = pool as jest.Mocked<typeof pool>;

const createCountResult = (count: number): [RowDataPacket[], FieldPacket[]] => [
    [{ count }] as RowDataPacket[],
    [] as FieldPacket[]
];

const createWordResult = (word?: string): [RowDataPacket[], FieldPacket[]] => {
    if (word) {
        return [
            [{ word }] as RowDataPacket[],
            [] as FieldPacket[]
        ];
    }
    return [[] as RowDataPacket[], [] as FieldPacket[]];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createValidationResult = (isValid?: boolean, data?: any): [RowDataPacket[], FieldPacket[]] => {
    if (isValid === undefined) {
        return [[] as RowDataPacket[], [] as FieldPacket[]];
    }
    return [
        [{ is_valid: isValid, validation_data: data }] as RowDataPacket[],
        [] as FieldPacket[]
    ];
};

const createUpdateResult = (): [ResultSetHeader, FieldPacket[]] => [
    { affectedRows: 1 } as ResultSetHeader,
    [] as FieldPacket[]
];

describe('getWord', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('successful word retrieval', () => {
        it('should return a valid word with data when API validates successfully', async () => {
            // Mock database queries
            mockPool.query
                .mockResolvedValueOnce(createCountResult(5))
                .mockResolvedValueOnce(createWordResult('apple'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult());

            // Mock API response
            mockAxios.get.mockResolvedValue({
                status: 200,
                data: { definition: 'fruit' }
            });

            const result = await getWordFromDatabase('a', 5);

            expect(result.word).toBe('apple');
            expect(result.data).toEqual({ definition: 'fruit' });
            expect(mockPool.query).toHaveBeenCalledTimes(4);
            expect(mockAxios.get).toHaveBeenCalledWith('https://api.dictionaryapi.dev/api/v2/entries/en/apple');
        });

        it('should return cached valid word without API call', async () => {
            // Mock database queries
            mockPool.query
                .mockResolvedValueOnce(createCountResult(3))
                .mockResolvedValueOnce(createWordResult('apple'))
                .mockResolvedValueOnce(createValidationResult(true, { cached: true }));

            const result = await getWordFromDatabase('a', 5);

            expect(result.word).toBe('apple');
            expect(result.data).toEqual({ cached: true });
            expect(mockPool.query).toHaveBeenCalledTimes(3);
            expect(mockAxios.get).not.toHaveBeenCalled();
        });

        it('should work with first letter filter only', async () => {
            mockPool.query
                .mockResolvedValueOnce(createCountResult(10))
                .mockResolvedValueOnce(createWordResult('amazing'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult());

            mockAxios.get.mockResolvedValue({
                status: 200,
                data: { definition: 'wonderful' }
            });

            const result = await getWordFromDatabase('a');

            expect(result.word).toBe('amazing');
            expect(result.data).toEqual({ definition: 'wonderful' });
            expect(mockPool.query).toHaveBeenCalledWith(
                'SELECT COUNT(*) as count FROM words WHERE is_valid IS NOT FALSE AND first_letter = ?',
                ['a']
            );
        });

        it('should work with length filter only', async () => {
            mockPool.query
                .mockResolvedValueOnce(createCountResult(15))
                .mockResolvedValueOnce(createWordResult('words'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult());

            mockAxios.get.mockResolvedValue({
                status: 200,
                data: { definition: 'plural of word' }
            });

            const result = await getWordFromDatabase(undefined, 5);

            expect(result.word).toBe('words');
            expect(result.data).toEqual({ definition: 'plural of word' });
            expect(mockPool.query).toHaveBeenCalledWith(
                'SELECT COUNT(*) as count FROM words WHERE is_valid IS NOT FALSE AND length = ?',
                ['5']
            );
        });

        it('should work without any filters', async () => {
            mockPool.query
                .mockResolvedValueOnce(createCountResult(198219))
                .mockResolvedValueOnce(createWordResult('random'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult());

            mockAxios.get.mockResolvedValue({
                status: 200,
                data: { definition: 'without pattern' }
            });

            const result = await getWordFromDatabase();

            expect(result.word).toBe('random');
            expect(result.data).toEqual({ definition: 'without pattern' });
            expect(mockPool.query).toHaveBeenCalledWith(
                'SELECT COUNT(*) as count FROM words WHERE is_valid IS NOT FALSE',
                []
            );
        });
    });

    describe('invalid word handling', () => {
        it('should retry when API returns 404 and eventually find valid word', async () => {
            // Mock database queries for invalid word
            mockPool.query
                .mockResolvedValueOnce(createCountResult(2))
                .mockResolvedValueOnce(createWordResult('invalid'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult())
                // Second attempt with valid word
                .mockResolvedValueOnce(createCountResult(1))
                .mockResolvedValueOnce(createWordResult('valid'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult());

            // Mock API responses
            const mockAxiosError = new AxiosError('Not found');
            mockAxiosError.status = 404;
            mockAxios.get
                .mockRejectedValueOnce(mockAxiosError) // First word invalid
                .mockResolvedValueOnce({ status: 200, data: { definition: 'good' } }); // Second word valid

            const result = await getWordFromDatabase('v', 5);

            expect(result.word).toBe('valid');
            expect(result.data).toEqual({ definition: 'good' });
            expect(mockAxios.get).toHaveBeenCalledTimes(2);
        });

        it('should throw error after max attempts with invalid words', async () => {
            const mockAxiosError = new AxiosError('Not found');
            mockAxiosError.status = 404;

            // Mock all the calls for 10 attempts
            for (let i = 0; i < 10; i++) {
                mockPool.query
                    .mockResolvedValueOnce(createCountResult(1))
                    .mockResolvedValueOnce(createWordResult('invalid'))
                    .mockResolvedValueOnce(createValidationResult())
                    .mockResolvedValueOnce(createUpdateResult());
                mockAxios.get.mockRejectedValue(mockAxiosError);
            }

            await expect(getWordFromDatabase('x', 5)).rejects.toThrow('Unable to find a valid word after multiple attempts');
            expect(mockAxios.get).toHaveBeenCalledTimes(10); // maxAttempts
        });

        it('should not retry on non-404 API errors', async () => {
            mockPool.query
                .mockResolvedValueOnce(createCountResult(1))
                .mockResolvedValueOnce(createWordResult('apple'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult());

            const mockAxiosError = new AxiosError('Server error');
            mockAxiosError.status = 500;
            mockAxios.get.mockRejectedValue(mockAxiosError);

            const result = await getWordFromDatabase('a', 5);

            expect(result.word).toBe('apple');
            expect(result.data).toBeUndefined();
            expect(mockAxios.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('error handling', () => {
        it('should throw error when no words found for combination', async () => {
            mockPool.query.mockResolvedValueOnce(createCountResult(0));

            await expect(getWordFromDatabase('z', 50)).rejects.toThrow('No words found for the given combination: z, 50');
        });

        it('should throw error when no words found with first letter filter', async () => {
            mockPool.query.mockResolvedValueOnce(createCountResult(0));

            await expect(getWordFromDatabase('z')).rejects.toThrow('No words found for the given combination: z, no length filter');
        });

        it('should throw error when no words found with length filter', async () => {
            mockPool.query.mockResolvedValueOnce(createCountResult(0));

            await expect(getWordFromDatabase(undefined, 50)).rejects.toThrow('No words found for the given combination: no first letter filter, 50');
        });

        it('should throw error when no words found without filters', async () => {
            mockPool.query.mockResolvedValueOnce(createCountResult(0));

            await expect(getWordFromDatabase()).rejects.toThrow('No words found for the given combination: no first letter filter, no length filter');
        });

        it('should handle database errors gracefully', async () => {
            mockPool.query.mockRejectedValue(new Error('Database connection failed'));

            await expect(getWordFromDatabase('a', 5)).rejects.toThrow('Database connection failed');
        });
    });

    describe('database interaction', () => {
        it('should use correct WHERE clause for both filters', async () => {
            mockPool.query
                .mockResolvedValueOnce(createCountResult(5))
                .mockResolvedValueOnce(createWordResult('apple'))
                .mockResolvedValueOnce(createValidationResult(true, null));

            await getWordFromDatabase('a', 5);

            expect(mockPool.query).toHaveBeenCalledWith(
                'SELECT COUNT(*) as count FROM words WHERE is_valid IS NOT FALSE AND first_letter = ? AND length = ?',
                ['a', '5']
            );
        });

        it('should update database with validation result', async () => {
            mockPool.query
                .mockResolvedValueOnce(createCountResult(1))
                .mockResolvedValueOnce(createWordResult('test'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult());

            mockAxios.get.mockResolvedValue({
                status: 200,
                data: { definition: 'examination' }
            });

            await getWordFromDatabase('t', 4);

            expect(mockPool.query).toHaveBeenLastCalledWith(
                `UPDATE words 
         SET is_valid = ?, validation_data = ?, validated_at = NOW() 
         WHERE word = ?`,
                [true, '{"definition":"examination"}', 'test']
            );
        });

        it('should update database with invalid word result', async () => {
            mockPool.query
                .mockResolvedValueOnce(createCountResult(1))
                .mockResolvedValueOnce(createWordResult('invalid'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult())
                // Second attempt
                .mockResolvedValueOnce(createCountResult(1))
                .mockResolvedValueOnce(createWordResult('valid'))
                .mockResolvedValueOnce(createValidationResult())
                .mockResolvedValueOnce(createUpdateResult());

            const mockAxiosError = new AxiosError('Not found');
            mockAxiosError.status = 404;
            mockAxios.get
                .mockRejectedValueOnce(mockAxiosError)
                .mockResolvedValueOnce({ status: 200, data: { definition: 'good' } });

            await getWordFromDatabase('v', 5);

            expect(mockPool.query).toHaveBeenCalledWith(
                `UPDATE words 
         SET is_valid = ?, validation_data = ?, validated_at = NOW() 
         WHERE word = ?`,
                [false, null, 'invalid']
            );
        });
    });

    describe('edge cases', () => {
        it('should handle empty database result gracefully', async () => {
            mockPool.query
                .mockResolvedValueOnce(createCountResult(1))
                .mockResolvedValueOnce(createWordResult());

            await expect(getWordFromDatabase('a', 5)).rejects.toThrow('No words found for the given combination: a, 5');
        });

        it('should handle cached invalid words', async () => {
            mockPool.query
                .mockResolvedValueOnce(createCountResult(1))
                .mockResolvedValueOnce(createWordResult('invalid'))
                .mockResolvedValueOnce(createValidationResult(false, null))
                // Second attempt
                .mockResolvedValueOnce(createCountResult(1))
                .mockResolvedValueOnce(createWordResult('valid'))
                .mockResolvedValueOnce(createValidationResult(true, { cached: true }));

            const result = await getWordFromDatabase('v', 5);

            expect(result.word).toBe('valid');
            expect(result.data).toEqual({ cached: true });
            expect(mockAxios.get).not.toHaveBeenCalled();
        });

        it('should handle random offset correctly', async () => {
            const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);

            mockPool.query
                .mockResolvedValueOnce(createCountResult(100))
                .mockResolvedValueOnce(createWordResult('middle'))
                .mockResolvedValueOnce(createValidationResult(true, null));

            await getWordFromDatabase('m', 6);

            expect(mockPool.query).toHaveBeenCalledWith(
                'SELECT word FROM words WHERE is_valid IS NOT FALSE AND first_letter = ? AND length = ? LIMIT 1 OFFSET ?',
                ['m', '6', 50] // Math.floor(0.5 * 100) = 50
            );

            mockMathRandom.mockRestore();
        });
    });
});

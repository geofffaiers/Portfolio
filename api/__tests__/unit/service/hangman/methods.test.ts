import axios, { AxiosError } from 'axios';
import { getWordFromDatabase } from '@src/service/hangman/methods';
import { pool } from '@src/helpers/db';
import { RowDataPacket } from 'mysql2';

jest.mock('axios');
jest.mock('@src/helpers/db', () => ({
    pool: {
        query: jest.fn()
    }
}));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockPool = pool as jest.Mocked<typeof pool>;

describe('getWord', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('successful word retrieval', () => {
        it('should return a valid word with data when API validates successfully', async () => {
            // Mock database queries
            mockPool.query
                .mockResolvedValueOnce([[{ count: 5 }]] as any) // COUNT query
                .mockResolvedValueOnce([[{ word: 'apple' }]] as any) // Word selection
                .mockResolvedValueOnce([[]] as any) // Validation cache check (empty)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any); // UPDATE query

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
                .mockResolvedValueOnce([[{ count: 3 }]] as any) // COUNT query
                .mockResolvedValueOnce([[{ word: 'apple' }]] as any) // Word selection
                .mockResolvedValueOnce([[{ 
                    is_valid: true, 
                    validation_data: { cached: true } 
                }]] as any); // Validation cache hit

            const result = await getWordFromDatabase('a', 5);

            expect(result.word).toBe('apple');
            expect(result.data).toEqual({ cached: true });
            expect(mockPool.query).toHaveBeenCalledTimes(3);
            expect(mockAxios.get).not.toHaveBeenCalled();
        });

        it('should work with first letter filter only', async () => {
            mockPool.query
                .mockResolvedValueOnce([[{ count: 10 }]] as any)
                .mockResolvedValueOnce([[{ word: 'amazing' }]] as any)
                .mockResolvedValueOnce([[]] as any)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any);

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
                .mockResolvedValueOnce([[{ count: 15 }]] as any)
                .mockResolvedValueOnce([[{ word: 'words' }]] as any)
                .mockResolvedValueOnce([[]] as any)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any);

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
                .mockResolvedValueOnce([[{ count: 198219 }]] as any)
                .mockResolvedValueOnce([[{ word: 'random' }]] as any)
                .mockResolvedValueOnce([[]] as any)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any);

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
                .mockResolvedValueOnce([[{ count: 2 }]] as any) // COUNT query
                .mockResolvedValueOnce([[{ word: 'invalid' }]] as any) // First word (invalid)
                .mockResolvedValueOnce([[]] as any) // Validation cache check (empty)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any) // UPDATE invalid word
                // Second attempt
                .mockResolvedValueOnce([[{ count: 1 }]] as any) // COUNT query
                .mockResolvedValueOnce([[{ word: 'valid' }]] as any) // Second word (valid)
                .mockResolvedValueOnce([[]] as any) // Validation cache check (empty)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any); // UPDATE valid word

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
            // Mock database to always return invalid words
            // We need to mock each call separately since there will be multiple attempts
            
            // For each of the 10 attempts, we need: COUNT, SELECT, cache check, UPDATE
            const countMock = [{ count: 1 }];
            const selectMock = [{ word: 'invalid' }];
            const isValidMock: string[] = [];
            const updateMock = { affectedRows: 1 };

            const mockAxiosError = new AxiosError('Not found');
            mockAxiosError.status = 404;

            // Mock all the calls for 10 attempts
            for (let i = 0; i < 10; i++) {
                mockPool.query
                    .mockResolvedValueOnce([selectMock] as any) // Word selection
                    .mockResolvedValueOnce([countMock] as any) // COUNT query
                    .mockResolvedValueOnce([isValidMock] as any) // COUNT query
                    .mockResolvedValueOnce([updateMock] as any); // UPDATE query
                mockAxios.get.mockRejectedValueOnce(mockAxiosError);
            }

            await expect(getWordFromDatabase('x', 5)).rejects.toThrow('Unable to find a valid word after multiple attempts');
            expect(mockAxios.get).toHaveBeenCalledTimes(10); // maxAttempts
        });

        it('should not retry on non-404 API errors', async () => {
            mockPool.query
                .mockResolvedValueOnce([[{ count: 1 }]] as any)
                .mockResolvedValueOnce([[{ word: 'apple' }]] as any)
                .mockResolvedValueOnce([[]] as any)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any);

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
            mockPool.query.mockResolvedValueOnce([[{ count: 0 }]] as any);

            await expect(getWordFromDatabase('z', 50)).rejects.toThrow('No words found for the given combination: z, 50');
        });

        it('should throw error when no words found with first letter filter', async () => {
            mockPool.query.mockResolvedValueOnce([[{ count: 0 }]] as any);

            await expect(getWordFromDatabase('z')).rejects.toThrow('No words found for the given combination: z, no length filter');
        });

        it('should throw error when no words found with length filter', async () => {
            mockPool.query.mockResolvedValueOnce([[{ count: 0 }]] as any);

            await expect(getWordFromDatabase(undefined, 50)).rejects.toThrow('No words found for the given combination: no first letter filter, 50');
        });

        it('should throw error when no words found without filters', async () => {
            mockPool.query.mockResolvedValueOnce([[{ count: 0 }]] as any);

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
                .mockResolvedValueOnce([[{ count: 5 }]] as any)
                .mockResolvedValueOnce([[{ word: 'apple' }]] as any)
                .mockResolvedValueOnce([[{ is_valid: true, validation_data: null }]] as any);

            await getWordFromDatabase('a', 5);

            expect(mockPool.query).toHaveBeenCalledWith(
                'SELECT COUNT(*) as count FROM words WHERE is_valid IS NOT FALSE AND first_letter = ? AND length = ?',
                ['a', '5']
            );
        });

        it('should update database with validation result', async () => {
            mockPool.query
                .mockResolvedValueOnce([[{ count: 1 }]] as any)
                .mockResolvedValueOnce([[{ word: 'test' }]] as any)
                .mockResolvedValueOnce([[]] as any)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any);

            mockAxios.get.mockResolvedValue({
                status: 200,
                data: { definition: 'examination' }
            });

            await getWordFromDatabase('t', 4);

            expect(mockPool.query).toHaveBeenLastCalledWith(
                'UPDATE words SET is_valid = ?, validation_data = ?, validated_at = NOW() WHERE word = ?',
                [true, '{"definition":"examination"}', 'test']
            );
        });

        it('should update database with invalid word result', async () => {
            mockPool.query
                .mockResolvedValueOnce([[{ count: 1 }]] as any)
                .mockResolvedValueOnce([[{ word: 'invalid' }]] as any)
                .mockResolvedValueOnce([[]] as any)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any)
                // Second attempt
                .mockResolvedValueOnce([[{ count: 1 }]] as any)
                .mockResolvedValueOnce([[{ word: 'valid' }]] as any)
                .mockResolvedValueOnce([[]] as any)
                .mockResolvedValueOnce([{ affectedRows: 1 }] as any);

            const mockAxiosError = new AxiosError('Not found');
            mockAxiosError.status = 404;
            mockAxios.get
                .mockRejectedValueOnce(mockAxiosError)
                .mockResolvedValueOnce({ status: 200, data: { definition: 'good' } });

            await getWordFromDatabase('v', 5);

            expect(mockPool.query).toHaveBeenCalledWith(
                'UPDATE words SET is_valid = ?, validation_data = ?, validated_at = NOW() WHERE word = ?',
                [false, null, 'invalid']
            );
        });
    });

    describe('edge cases', () => {
        it('should handle empty database result gracefully', async () => {
            mockPool.query
                .mockResolvedValueOnce([[{ count: 1 }]] as any)
                .mockResolvedValueOnce([[]] as any); // Empty result

            await expect(getWordFromDatabase('a', 5)).rejects.toThrow('No words found for the given combination: a, 5');
        });

        it('should handle cached invalid words', async () => {
            mockPool.query
                .mockResolvedValueOnce([[{ count: 1 }]] as any)
                .mockResolvedValueOnce([[{ word: 'invalid' }]] as any)
                .mockResolvedValueOnce([[{ is_valid: false, validation_data: null }]] as any)
                // Second attempt
                .mockResolvedValueOnce([[{ count: 1 }]] as any)
                .mockResolvedValueOnce([[{ word: 'valid' }]] as any)
                .mockResolvedValueOnce([[{ is_valid: true, validation_data: { cached: true } }]] as any);

            const result = await getWordFromDatabase('v', 5);

            expect(result.word).toBe('valid');
            expect(result.data).toEqual({ cached: true });
            expect(mockAxios.get).not.toHaveBeenCalled();
        });

        it('should handle random offset correctly', async () => {
            const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);

            mockPool.query
                .mockResolvedValueOnce([[{ count: 100 }]] as any)
                .mockResolvedValueOnce([[{ word: 'middle' }]] as any)
                .mockResolvedValueOnce([[{ is_valid: true, validation_data: null }]] as any);

            await getWordFromDatabase('m', 6);

            expect(mockPool.query).toHaveBeenCalledWith(
                'SELECT word FROM words WHERE is_valid IS NOT FALSE AND first_letter = ? AND length = ? LIMIT 1 OFFSET ?',
                ['m', '6', 50] // Math.floor(0.5 * 100) = 50
            );

            mockMathRandom.mockRestore();
        });
    });
});
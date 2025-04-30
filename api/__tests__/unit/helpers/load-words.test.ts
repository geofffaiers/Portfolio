import fs from 'fs/promises';
import axios, { AxiosError } from 'axios';
import { Words } from '@src/helpers/load-words';
import { logError } from '@src/helpers/errors';
import { mockWords, resetWordsStatics, WordsStatics } from '@mocks/helpers/load-words';

jest.mock('fs/promises');
jest.mock('axios');
jest.mock('@src/helpers/errors', () => ({
    logError: jest.fn()
}));

const mockAxiosError = new AxiosError('fail');
const mockError = new Error('fail');

describe('Words', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        resetWordsStatics();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        resetWordsStatics();
    });

    it('should load words from file and return a valid word with data', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords.join('\n'));
        (axios.get as jest.Mock).mockResolvedValue({ status: 200, data: { definition: 'fruit' } });

        const result = await Words.getWord('a', 5);

        expect(result.word).toBe('apple');
        expect(result.data).toEqual({ definition: 'fruit' });
    });

    it('should return a valid word for { a, 5 } with data from cache', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords.join('\n'));
        const statics = Words as unknown as WordsStatics;
        statics._validationCache = { apple: { isValid: true, data: { cached: true } } };

        const result = await Words.getWord('a', 5);

        expect(result.word).toBe('apple');
        expect(result.data).toEqual({ cached: true });
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('should return a valid word for { a } with data from cache', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords.join('\n'));
        const statics = Words as unknown as WordsStatics;
        statics._validationCache = { apple: { isValid: true, data: { cached: true } } };

        const result = await Words.getWord('a');

        expect(result.word).toBe('apple');
        expect(result.data).toEqual({ cached: true });
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('should return a valid word for { 5 } with data from cache', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords.join('\n'));
        const statics = Words as unknown as WordsStatics;
        statics._validationCache = { apple: { isValid: true, data: { cached: true } } };

        const result = await Words.getWord(undefined, 5);

        expect(result.word).toBe('apple');
        expect(result.data).toEqual({ cached: true });
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('should return a valid word for { } with data from cache', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords[0]);
        const statics = Words as unknown as WordsStatics;
        statics._validationCache = { apple: { isValid: true, data: { cached: true } } };

        const result = await Words.getWord();

        expect(result.word).toBe('apple');
        expect(result.data).toEqual({ cached: true });
        expect(axios.get).not.toHaveBeenCalled();
    });

    it('should remove invalid word and retry if API returns 404, then throw if no words left', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords[0]);
        mockAxiosError.status = 404;
        (axios.get as jest.Mock).mockRejectedValueOnce(Object.assign(mockAxiosError));

        await expect(Words.getWord('a', 5)).rejects.toThrow('No words found for the given combination: a, 5');
    });

    it('should remove invalid word and retry if API returns 404, then throw if no words left', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords[0]);
        mockAxiosError.status = 404;
        (axios.get as jest.Mock).mockRejectedValueOnce(Object.assign(mockAxiosError));

        await expect(Words.getWord('a')).rejects.toThrow('No words found for the given combination: a, no length filter');
    });

    it('should remove invalid word and retry if API returns 404, then throw if no words left', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords[0]);
        mockAxiosError.status = 404;
        (axios.get as jest.Mock).mockRejectedValueOnce(Object.assign(mockAxiosError));

        await expect(Words.getWord(undefined, 5)).rejects.toThrow('No words found for the given combination: no first letter filter, 5');
    });

    it('should remove invalid word and retry if API returns 404, then throw if no words left', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords[0]);
        mockAxiosError.status = 404;
        (axios.get as jest.Mock).mockRejectedValueOnce(Object.assign(mockAxiosError));

        await expect(Words.getWord()).rejects.toThrow('No words found for the given combination: no first letter filter, no length filter');
    });

    it('should not remove word if API returns non-404 error', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords[0]);
        mockAxiosError.status = 500;
        (axios.get as jest.Mock).mockRejectedValueOnce(Object.assign(mockAxiosError));

        const result = await Words.getWord('a', 5);

        expect(result.word).toBe('apple');
        expect(result.data).not.toBeDefined();
    });

    it('should log error if reading file fails', async () => {
        (fs.readFile as jest.Mock).mockRejectedValue(mockError);

        await expect(Words.getWord('a', 5)).rejects.toThrow();
        expect(logError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should log error if saving file fails', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords[0]);
        mockAxiosError.status = 404;
        (axios.get as jest.Mock).mockRejectedValueOnce(Object.assign(mockAxiosError));
        (fs.writeFile as jest.Mock).mockRejectedValue(mockError);

        await expect(Words.getWord('a', 5)).rejects.toThrow();
    });
    it('should clear existing saveTimeout before setting a new one in debouncedSaveWordsToFile', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockWords[0]);
        mockAxiosError.status = 404;
        (axios.get as jest.Mock).mockRejectedValueOnce(Object.assign(mockAxiosError));
        (fs.writeFile as jest.Mock).mockRejectedValue(mockError);

        const statics = Words as unknown as WordsStatics;
        statics.saveTimeout = setTimeout(() => {}, 10000);

        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

        await expect(Words.getWord('a', 5)).rejects.toThrow();

        expect(clearTimeoutSpy).toHaveBeenCalledWith(expect.any(Object));

        clearTimeoutSpy.mockRestore();
        if (statics.saveTimeout) clearTimeout(statics.saveTimeout);
        statics.saveTimeout = null;
    });
});

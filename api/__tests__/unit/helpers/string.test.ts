import { getRandomString } from '@src/helpers/string';

describe('getRandomString', () => {
    it('should return a string of the specified length', () => {
        const length = 10;

        const result = getRandomString(length);

        expect(typeof result).toBe('string');
        expect(result).toHaveLength(length);
    });

    it('should return an empty string when length is 0', () => {
        const result = getRandomString(0);

        expect(result).toBe('');
    });

    it('should only contain valid characters', () => {
        const length = 50;

        const result = getRandomString(length);

        expect(result).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should return different strings on subsequent calls', () => {
        const length = 12;

        const result1 = getRandomString(length);

        const result2 = getRandomString(length);

        expect(result1).not.toBe(result2);
    });
});

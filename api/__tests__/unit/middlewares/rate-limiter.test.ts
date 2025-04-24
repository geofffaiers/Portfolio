import { rateLimit } from 'express-rate-limit';
import { limiter } from '@src/middlewares/rate-limiter';

const mockLimiter = (limit = 1000) => ({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again soon.'
});

describe('limiter', () => {
    it('should call rateLimit with default limit when no argument is provided', () => {
        (rateLimit as jest.Mock).mockReturnValue('mockedLimiter');

        const result = limiter();

        expect(rateLimit).toHaveBeenCalledWith(mockLimiter());

        expect(result).toBe('mockedLimiter');
    });

    it('should call rateLimit with provided limit', () => {
        (rateLimit as jest.Mock).mockReturnValue('mockedLimiter');

        const result = limiter(42);

        expect(rateLimit).toHaveBeenCalledWith(mockLimiter(42));

        expect(result).toBe('mockedLimiter');
    });
});

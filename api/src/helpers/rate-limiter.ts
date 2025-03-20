import rateLimit from 'express-rate-limit';

export const limiter = (limit = 1000) => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again soon.'
});

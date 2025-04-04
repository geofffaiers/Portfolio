import { NextFunction } from 'express';
import { DefaultResponse } from '../models';
import { pool } from './db';

export const handleRoutingError = (err: unknown, next: NextFunction): void => {
    if (err instanceof Error) {
        next(err);
    } else {
        next(new Error(`An unexpected error occurred: ${JSON.stringify(err)}`));
    }
};

export const reportError = async (err: Error): Promise<void> => {
    await pool.query('INSERT INTO errors (message) VALUES (?)', [err.message]);
};

export const handleError = <T = undefined>(err: unknown): DefaultResponse<T> => {
    if (err instanceof Error) {
        return {
            code: 500,
            success: false,
            message: err.message
        };
    }
    throw new Error('An unexpected error occurred');
};

export const logError = (err: unknown): void => {
    if (err instanceof Error) {
        console.error(err.message); // eslint-disable-line no-console
    } else {
        console.error(JSON.stringify(err));  // eslint-disable-line no-console
    }
};

import { Application } from 'express';
import configRoutes from './config';
import hangmanRoutes from './hangman';
import messagingRoutes from './messaging';
import planningPokerRoutes from './planning-poker';
import scoresRoutes from './scores';
import usersRoutes from './users';
import { pool } from '@src/helpers';

export const router = (app: Application): void => {
    app.use('/api/config', configRoutes);
    app.use('/api/hangman', hangmanRoutes);
    app.use('/api/messaging', messagingRoutes);
    app.use('/api/planning-poker', planningPokerRoutes);
    app.use('/api/scores', scoresRoutes);
    app.use('/api/users', usersRoutes);

    app.get('/api/health', async (_req, res) => {
        try {
            // Check database connectivity
            await pool.query('SELECT 1');

            res.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        } catch (error) {
            res.status(503).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
};

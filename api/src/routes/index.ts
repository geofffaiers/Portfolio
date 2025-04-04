import { Application } from 'express';
import configRoutes from './config';
import hangmanRoutes from './hangman';
import messagingRoutes from './messaging';
import planningPokerRoutes from './planning-poker';
import scoresRoutes from './scores';
import usersRoutes from './users';

export const router = (app: Application): void => {
    app.use('/api/config', configRoutes);
    app.use('/api/hangman', hangmanRoutes);
    app.use('/api/messaging', messagingRoutes);
    app.use('/api/planning-poker', planningPokerRoutes);
    app.use('/api/scores', scoresRoutes);
    app.use('/api/users', usersRoutes);
};

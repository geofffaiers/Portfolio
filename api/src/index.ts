/* eslint-disable no-console */

import 'reflect-metadata';
import express from 'express';
import { Server } from './server';
import { reportError } from './helpers';

const loadEnvironment = async (): Promise<void> => {
    if (process.env.NODE_ENV !== 'production' && !process.env.DOCKER_ENV) {
        const { config } = await import('dotenv');
        config({ path: '../.env.development' });
        console.log('Environment variables loaded successfully.');
    }
    console.log('Loaded environment.');
};

const startServer = async (): Promise<void> => {
    await loadEnvironment();

    const PORT: string | undefined = process.env.API_PORT;
    const server: Server = new Server(express());
    server.start(PORT);
};

startServer().catch((err: Error) => {
    console.error('Failed to start server:', err);
    reportError(err).catch(console.error);
    process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught exception:', err);
    reportError(err).catch(console.error);
});

process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled rejection:', err);
    reportError(err).catch(console.error);
});

/* eslint-disable no-console */

import dotenv from 'dotenv';
import 'reflect-metadata';
import express from 'express';
import { Server } from './server';
import { reportError } from './helpers';

const envPath = process.env.NODE_ENV == null ? '../.env' : `../.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envPath });

const PORT: string | undefined = process.env.APP_ENV === 'staging'
    ? process.env.STAGING_API_PORT
    : process.env.API_PORT;
const server: Server = new Server(express());
server.start(PORT);

process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught exception:', err);
    reportError(err).catch(console.error);
});
process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled rejection:', err);
    reportError(err).catch(console.error);
});

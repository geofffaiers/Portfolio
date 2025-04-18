/* eslint-disable @typescript-eslint/no-require-imports */
describe('db helper', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a pool with correct config when module is loaded', () => {
        jest.resetModules();

        jest.doMock('mysql2/promise', () => ({
            createPool: jest.fn(() => ({
                end: jest.fn().mockResolvedValue(undefined)
            }))
        }));

        require('@src/helpers/db');
        const mysql = require('mysql2/promise');

        expect(mysql.createPool).toHaveBeenCalled();
        const config = mysql.createPool.mock.calls[0][0];
        expect(config).toHaveProperty('host');
        expect(config).toHaveProperty('user');
        expect(config).toHaveProperty('password');
        expect(config).toHaveProperty('database');
    });

    it('should call pool.end when closePool is invoked', async () => {
        jest.resetModules();

        jest.doMock('mysql2/promise', () => ({
            createPool: jest.fn(() => ({
                end: jest.fn().mockResolvedValue(undefined)
            }))
        }));

        const dbHelper = require('@src/helpers/db');

        await dbHelper.closePool();

        expect(dbHelper.pool.end).toHaveBeenCalled();
    });
});

describe('db helper dotenv config', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        jest.resetModules();
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.clearAllMocks();
    });

    it('should load .env if NODE_ENV is undefined', () => {
        delete process.env.NODE_ENV;

        jest.resetModules();

        const dotenv = require('dotenv');
        const configSpy = jest.spyOn(dotenv, 'config');

        require('@src/helpers/db');

        expect(configSpy).toHaveBeenCalledWith(
            expect.objectContaining({ path: expect.stringContaining('.env') })
        );
        expect(configSpy).toHaveBeenCalledWith();
    });

    it('should load .env.<NODE_ENV> if NODE_ENV is set', () => {
        process.env.NODE_ENV = 'testenv';

        jest.resetModules();

        const dotenv = require('dotenv');
        const configSpy = jest.spyOn(dotenv, 'config');

        require('@src/helpers/db');

        expect(configSpy).toHaveBeenCalledWith(
            expect.objectContaining({ path: expect.stringContaining('.env.testenv') })
        );
    });

    it('should load .env.<NODE_ENV> if NODE_ENV and APP_ENV is set', () => {
        process.env.NODE_ENV = 'testenv';
        process.env.APP_ENV = 'staging';

        jest.resetModules();

        const dotenv = require('dotenv');
        const configSpy = jest.spyOn(dotenv, 'config');

        require('@src/helpers/db');

        expect(configSpy).toHaveBeenCalledWith(
            expect.objectContaining({ path: expect.stringContaining('.env.testenv') })
        );
    });
});

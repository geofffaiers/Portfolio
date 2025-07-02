import mysql from 'mysql2/promise';
import { pool, closePool } from '@src/helpers/db';

jest.mock('mysql2/promise', () => ({
    ...jest.requireActual('mysql2/promise'),
    createPool: jest.fn().mockImplementation((config: mysql.PoolOptions) => {
        return {
            end: jest.fn(),
            config
        };
    })
}));

describe('db helper', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a pool with correct config when module is loaded', () => {
        expect(mysql.createPool).toHaveBeenCalled();

        expect(pool.config).toEqual({
            connectionLimit: 10,
            database: 'portfolio',
            enableKeepAlive: true,
            host: 'localhost',
            idleTimeout: 60000,
            keepAliveInitialDelay: 0,
            maxIdle: 10,
            password: process.env.MYSQL_ROOT_PASSWORD,
            queueLimit: 0,
            user: 'root',
            waitForConnections: true
        });
    });

    it('should call pool.end when closePool is invoked', async () => {
        closePool();

        expect(pool.end).toHaveBeenCalled();
    });
});

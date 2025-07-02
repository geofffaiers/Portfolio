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

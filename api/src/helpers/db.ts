import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';

const envFileName = process.env.NODE_ENV == null ? '.env' : `.env.${process.env.NODE_ENV}`;
const envPath = path.resolve(process.cwd(), '..', envFileName);
dotenv.config({ path: envPath });

dotenv.config();

const getConfig = (): mysql.PoolOptions => {
    const host = process.env.APP_ENV === 'staging' ?
        process.env.STAGING_MYSQL_HOST :
        process.env.MYSQL_HOST;

    return {
        host,
        user: process.env.MYSQL_ROOT_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    };
};

export const pool: mysql.Pool = mysql.createPool(getConfig());

export const closePool = async (): Promise<void> => {
    await pool?.end();
};

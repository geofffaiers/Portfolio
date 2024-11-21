import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

const envPath = process.env.NODE_ENV == null ? '../.env' : `../.env.${process.env.NODE_ENV}`
dotenv.config({ path: envPath })

const getConfig = (): mysql.PoolOptions => {
  return {
    host: process.env.MYSQL_HOST,
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
  }
}

export const pool: mysql.Pool = mysql.createPool(getConfig())

export const closePool = async (): Promise<void> => {
  await pool?.end()
}

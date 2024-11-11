import dotenv from 'dotenv'
import 'reflect-metadata'

const envPath = process.env.NODE_ENV == null ? '../.env' : `../.env.${process.env.NODE_ENV}`
dotenv.config({ path: envPath })

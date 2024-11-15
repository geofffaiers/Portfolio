import 'reflect-metadata'
import { execSync } from 'child_process'
import dotenv from 'dotenv'

const envPath = process.env.NODE_ENV == null ? '../.env' : `../.env.${process.env.NODE_ENV}`
dotenv.config({ path: envPath })

const port = process.env.CLIENT_PORT
if (port == null) {
  throw new Error('CLIENT_PORT is not defined')
}
execSync(
  process.env.NODE_ENV === 'development'
    ? `next dev -p ${port}`
    : `next start -p ${port}`,
  { stdio: 'inherit' }
)

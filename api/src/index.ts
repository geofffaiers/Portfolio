import dotenv from 'dotenv'
import 'reflect-metadata'
import express from 'express'
import { Server } from './server'
import { reportError } from './helpers'

const envPath = process.env.NODE_ENV == null ? '../.env' : `../.env.${process.env.NODE_ENV}`
dotenv.config({ path: envPath })

const PORT: string | undefined = process.env.API_PORT
const server: Server = new Server(express())
server.start(PORT)

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught exception:', err)
  reportError(err)
})
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled rejection:', err)
  reportError(err)
})

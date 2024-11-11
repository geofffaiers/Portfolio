import express, { Application } from 'express'
import { beforeAll, afterAll } from '@jest/globals'
import { Server } from '../server'

const app: Application = express()
const server: Server = new Server(app)

beforeAll(() => {
  const port: number = parseInt(process.env.API_PORT ?? '5001')
  server.start(port.toString())
})

afterAll(done => {
  server
    .close()
    .then(() => {
      done()
    })
})

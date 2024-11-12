import express, { Application, Request as ExpressRequest, NextFunction, Response } from 'express'
import morgan from 'morgan'
import cors, { CorsOptions } from 'cors'
import { Server as HttpServer, IncomingMessage } from 'http'
import { WebSocketServer } from 'ws'
import { closePool } from './helpers/db'
import { handleWebSocketConnection } from './routes/ws'
import { defaultError } from './service/errors'
import { router } from './routes'
import { zxcvbnOptions } from '@zxcvbn-ts/core'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en'

declare module 'express-serve-static-core' {
  interface Request {
    server?: Server
    userId?: number
  }
}

export class Server {
  #app: Application
  #serverInstance: HttpServer | undefined
  #wss: WebSocketServer | undefined

  constructor (app: Application) {
    if (process.env.MY_SQL_ROOT_USER == null || process.env.MYSQL_ROOT_PASSWORD == null) {
      throw new Error('Add .env file with values: MY_SQL_ROOT_USER and MYSQL_ROOT_PASSWORD')
    }
    this.#app = app
    this.#config()
    router(app)
    this.#errorHandler()
  }

  #config (): void {
    const corsOptions: CorsOptions = {
      origin: '*'
    }
    this.#app.use((req: ExpressRequest, _: Response, next: NextFunction) => {
      req.server = this
      next()
    })
    this.#app.use(morgan('dev'))
    this.#app.use(cors(corsOptions))
    this.#app.use(express.json())
    this.#app.use(express.urlencoded({ extended: true }))
    zxcvbnOptions.setOptions({
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations
    })
  }

  #errorHandler (): void {
    this.#app.use((err: Error, _: ExpressRequest, res: Response, __: NextFunction): void => {
      res.status(500).send(defaultError(err))
    })
  }

  start = (port: string | undefined): void => {
    const p: string = port ?? '3000'
    this.#serverInstance = this.#app
      .listen(parseInt(p), '0.0.0.0', () => {
        console.log(`Server is listening on port ${p}`)
      })
      .on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.error('Error: Port is already in use')
        } else {
          console.error(err)
        }
      })

    this.#wss = new WebSocketServer({ noServer: true })
    handleWebSocketConnection(this.#wss)
    this.#serverInstance.on('upgrade', (request: IncomingMessage, socket, head) => {
      const pathname = new URL(request.url ?? '', `http://${request.headers.host}`).pathname

      if (pathname === '/ws') {
        this.#wss!.handleUpgrade(request, socket, head, (ws) => {
          this.#wss!.emit('connection', ws, request)
        })
      } else {
        socket.destroy()
      }
    })
  }

  getWebSocketServer = (): WebSocketServer | undefined => {
    return this.#wss
  }

  close = async (): Promise<void> => {
    const closeHttpServer = new Promise<void>((resolve, reject) => {
      if (this.#serverInstance !== undefined) {
        this.#serverInstance.close(async (err: any) => {
          if (err) {
            console.error('Error closing the server: ', err)
            reject(err)
          } else {
            try {
              await closePool()
              resolve()
            } catch (poolErr) {
              console.error('Error closing the database pool: ', poolErr)
              reject(poolErr)
            }
          }
        })
      } else {
        resolve()
      }
    })

    const closeWebSocketServer = new Promise<void>((resolve, reject) => {
      if (this.#wss !== undefined) {
        this.#wss.close((err) => {
          if (err != null) {
            console.error('Error closing the WebSocket server: ', err)
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        resolve()
      }
    })

    await Promise.all([closeHttpServer, closeWebSocketServer])
  }
}

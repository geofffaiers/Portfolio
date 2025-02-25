import express, { Application, Request as ExpressRequest, NextFunction, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import { Server as HttpServer, IncomingMessage } from 'http';
import { WebSocketServer } from 'ws';
import { closePool } from './helpers/db';
import { handleWebSocketConnection } from './routes/ws';
import { defaultError } from './service/errors';
import { router } from './routes';
import { zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { setupSwagger } from './helpers/spec';
import { logError } from './helpers';

declare module 'express' {
  interface Request {
    server?: Server
    userId?: number
  }
}

export class Server {
    readonly #app: Application;
    #serverInstance: HttpServer | undefined;
    #wss: WebSocketServer | undefined;

    constructor (app: Application) {
        if (process.env.MYSQL_ROOT_USER == null || process.env.MYSQL_ROOT_PASSWORD == null) {
            throw new Error('Add .env file with values: MYSQL_ROOT_USER and MYSQL_ROOT_PASSWORD');
        }
        this.#app = app;
        this.#config();
        router(app);
        setupSwagger(app);
        this.#errorHandler();
    }

    #config (): void {
        const allowedOrigins: string[] = ['http://gfaiers.com', 'https://gfaiers.com', 'http://www.gfaiers.com', 'https://www.gfaiers.com'];
        if (process.env.CLIENT_URL != null && !allowedOrigins.includes(process.env.CLIENT_URL)) {
            allowedOrigins.push(process.env.CLIENT_URL);
        }

        const corsOptions: CorsOptions = {
            origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
                if (process.env.NODE_ENV === 'development') {
                    callback(null, true);
                } else if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        };
        this.#app.use((req: ExpressRequest, _: Response, next: NextFunction) => {
            req.server = this;
            next();
        });
        this.#app.use(morgan('dev'));
        this.#app.use(cors(corsOptions));
        this.#app.use(cookieParser());
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
        zxcvbnOptions.setOptions({
            dictionary: {
                ...zxcvbnCommonPackage.dictionary,
                ...zxcvbnEnPackage.dictionary
            },
            graphs: zxcvbnCommonPackage.adjacencyGraphs,
            translations: zxcvbnEnPackage.translations
        });
    }

    #errorHandler (): void {
        this.#app.use((err: Error, _: ExpressRequest, res: Response, __: NextFunction): void => {
            res.status(500).send(defaultError(err));
        });
    }

    start = (port: string | undefined): void => {
        const p: string = port ?? '3000';
        this.#serverInstance = this.#app
            .listen(parseInt(p), '0.0.0.0', () => {
                console.log(`Server is listening on port ${p}`); // eslint-disable-line no-console
            })
            .on('error', (err: unknown) => {
                if (err && typeof err  === 'object' && 'code' in err && typeof err.code === 'string' && err.code === 'EADDRINUSE') {
                    console.error('Error: Port is already in use'); // eslint-disable-line no-console
                } else {
                    logError(err);
                }
            });

        this.#wss = new WebSocketServer({ noServer: true });
        handleWebSocketConnection(this.#wss);
        this.#serverInstance.on('upgrade', (request: IncomingMessage, socket, head) => {
            const pathname = new URL(request.url ?? '', `http://${request.headers.host ?? ''}`).pathname;

            if (pathname === '/api/ws') {
                this.#wss?.handleUpgrade(request, socket, head, (ws) => {
                    this.#wss?.emit('connection', ws, request);
                });
            } else {
                socket.destroy();
            }
        });
    };

    getWebSocketServer = (): WebSocketServer | undefined => {
        return this.#wss;
    };

    close = async (): Promise<void> => {
        const closeHttpServer = new Promise<void>((resolve, reject) => {
            if (this.#serverInstance !== undefined) {
                this.#serverInstance.close((err: Error | undefined) => {
                    if (err != null) {
                        logError(new Error(`Error closing the server: ${err.message}`));
                        reject();
                    } else {
                        closePool()
                            .then(() => {
                                resolve();
                            })
                            .catch((err: unknown) => {
                                logError(new Error(`Error closing the database pool: ${JSON.stringify(err)}`));
                                reject();
                            });
                    }
                });
            } else {
                resolve();
            }
        });

        const closeWebSocketServer = new Promise<void>((resolve, reject) => {
            if (this.#wss !== undefined) {
                this.#wss.close((err: Error | undefined) => {
                    if (err != null) {
                        logError(new Error(`Error closing the WebSocket server: ${err.message}`));
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });

        await Promise.all([closeHttpServer, closeWebSocketServer]);
    };
}

import { NextFunction, Request, Response } from 'express';
import { CreateRoom, DefaultResponse, GetRoom, GetRooms } from '../models';
import { handleRoutingError } from '../helpers';
import { createGame, createRoom, getRoom, getRooms, joinRoom, disconnect, endRound, newRound, endGame, updateRoom, connectGuest } from '../service/planning-poker';

export default class PlanningPokerController {
    async connectGuest (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<{ ids: number[] }> = await connectGuest(req, res);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async getRooms (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<GetRooms> = await getRooms(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async getRoom (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<GetRoom> = await getRoom(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async joinRoom (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<GetRoom> = await joinRoom(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async createRoom (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<CreateRoom> = await createRoom(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async createGame (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse = await createGame(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async disconnect (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse = await disconnect(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async endRound (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse = await endRound(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async newRound (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse = await newRound(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async endGame (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse = await endGame(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async updateRoom (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse = await updateRoom(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }
}

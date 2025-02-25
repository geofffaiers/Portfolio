import { NextFunction, Request, Response } from 'express';
import { CreateRoom, DefaultResponse, GetRoom, GetRooms } from '../models';
import { handleRoutingError } from '../helpers';
import { createRoom, getRoom, getRooms } from '../service/planning-poker';

export default class PlanningPokerController {
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

    async createRoom (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<CreateRoom> = await createRoom(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }
}

import { NextFunction, Request, Response } from 'express';
import { getScores, saveScores } from '../service/scores';
import { DefaultResponse, GetScores, SaveScores } from '../models';
import { handleRoutingError } from '../helpers';

export default class ScoresController {
    async saveScores (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<SaveScores> = await saveScores(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async getScores (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<GetScores> = await getScores(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }
}

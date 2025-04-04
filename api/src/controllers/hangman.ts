import { NextFunction, Request, Response } from 'express';
import { DefaultResponse } from '../models';
import { handleRoutingError } from '../helpers';
import { WordWithData } from '../models';
import { getWord } from '../service/hangman';

export default class HangmanController {
    async getWord (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<WordWithData> = await getWord(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }
}

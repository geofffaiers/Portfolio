import { NextFunction, Request, Response } from 'express';
import { ConfigResponse, DefaultResponse } from '../models';
import { handleRoutingError } from '../helpers';
import { getConfig } from '../service/config';

export default class ConfigController {
    async getConfig (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<ConfigResponse> = await getConfig(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }
}

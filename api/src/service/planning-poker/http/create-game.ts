import { Request } from 'express';
import { DefaultResponse } from '../../../models';
import { handleError } from '../../../helpers';
import { createGameAndSaveToDb, sendGameToClients } from '../methods';

export const createGame = async (req: Request): Promise<DefaultResponse> => {
    try {
        if (req.userId == null) {
            return {
                code: 400,
                success: false,
                message: 'User not found'
            };
        }
        const gameId = await createGameAndSaveToDb(req.body.roomId, req.body.name, req.userId);
        await sendGameToClients(gameId);
        return {
            success: true,
            code: 200
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

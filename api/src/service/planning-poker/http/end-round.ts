import { Request } from 'express';
import { DefaultResponse } from '../../../models';
import { handleError } from '../../../helpers';
import { finishActiveRoundsForGame, sendRoundToClients } from '../methods';

export const endRound = async (req: Request): Promise<DefaultResponse> => {
    try {
        const roundId: number | undefined = req.query.roundId
            ? Number(req.query.roundId)
            : undefined;
        if (roundId == null) {
            return {
                code: 400,
                success: false,
                message: 'No round id provided'
            };
        }
        await finishActiveRoundsForGame(undefined, roundId);
        await sendRoundToClients(roundId);
        return {
            success: true,
            code: 200,
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

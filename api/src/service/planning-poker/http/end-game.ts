import { Request } from "express";
import { DefaultResponse } from "../../../models";
import { handleError } from "../../../helpers";
import { finishActiveGamesForRoom, sendGameToClients } from "../methods";

export const endGame = async (req: Request): Promise<DefaultResponse> => {
    try {
        const gameId: number | undefined = req.query.gameId
            ? Number(req.query.gameId)
            : undefined;
        if (gameId == null) {
            return {
                code: 400,
                success: false,
                message: 'No game id provided'
            }
        }
        await finishActiveGamesForRoom(undefined, gameId, Boolean(req.body?.success));
        await sendGameToClients(gameId);
        return {
            success: true,
            code: 200,
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

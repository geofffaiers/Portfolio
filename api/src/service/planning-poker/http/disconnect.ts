import { Request } from 'express';
import { DefaultResponse } from '../../../models';
import { handleError } from '../../../helpers';
import { sendPlayersToClients, setOnline } from '../methods';

export const disconnect = async (req: Request): Promise<DefaultResponse> => {
    try {
        let body;
        if (req.is('text/plain')) {
            body = JSON.parse(req.body);
        } else {
            body = req.body;
        }
        const { userId, guestSessionId, roomId } = body;
        if (roomId == null || (userId == null && guestSessionId == null)) {
            return {
                code: 400,
                success: false,
                message: 'Invalid request'
            };
        }
        await setOnline(roomId, false, userId, guestSessionId);
        await sendPlayersToClients(roomId);
        return {
            success: true,
            code: 200
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

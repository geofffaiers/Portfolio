import { Request } from 'express';
import { DefaultResponse } from '../../../models';
import { handleError } from '../../../helpers';
import { disconnectFromRoom, sendPlayersToClients } from '../methods';

export const disconnect = async (req: Request): Promise<DefaultResponse> => {
    try {
        let body;
        if (req.is('text/plain')) {
            body = JSON.parse(req.body);
        } else {
            body = req.body;
        }
        const { userId, roomId } = body;
        if (roomId == null) {
            return {
                code: 400,
                success: false,
                message: 'No room id provided'
            };
        }
        if (userId == null) {
            return {
                code: 400,
                success: false,
                message: 'User not found'
            };
        }
        await disconnectFromRoom(roomId, userId);
        await sendPlayersToClients(roomId);
        return {
            success: true,
            code: 200
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

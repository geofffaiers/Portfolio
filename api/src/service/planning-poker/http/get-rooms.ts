import { Request } from 'express';
import { DefaultResponse, GetRooms } from '../../../models';
import { handleError } from '../../../helpers';
import { getRoomsFromDbForPlayer, updateUserLastActive } from '../methods';

export const getRooms = async (req: Request): Promise<DefaultResponse<GetRooms>> => {
    try {
        if (req.userId == null && req.guestSessionId == null) {
            return {
                code: 400,
                success: false,
                message: 'Invalid request'
            };
        }
        await updateUserLastActive(req.userId, req.guestSessionId);
        return {
            success: true,
            code: 200,
            data: {
                rooms: await getRoomsFromDbForPlayer(req.userId, req.guestSessionId)
            }
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

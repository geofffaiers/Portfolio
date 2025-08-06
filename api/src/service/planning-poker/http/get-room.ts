import { Request } from 'express';
import { DefaultResponse, GetRoom, Room } from '../../../models';
import { handleError } from '../../../helpers';
import { getRoomDetails, sendPlayersToClients, setOnline } from '../methods';

export const getRoom = async (req: Request): Promise<DefaultResponse<GetRoom>> => {
    try {
        const roomId: string | undefined = req.query.roomId
            ? String(req.query.roomId)
            : undefined;
        if (roomId == null || (req.userId == null && req.guestSessionId == null)) {
            return {
                code: 400,
                success: false,
                message: 'Invalid request'
            };
        }
        await setOnline(roomId, true, req.userId, req.guestSessionId);
        const room: Room | undefined = await getRoomDetails(roomId);
        if (room == null) {
            return {
                code: 400,
                success: false,
                message: 'Room not found'
            };
        }
        await sendPlayersToClients(roomId, room.players);
        return {
            success: true,
            code: 200,
            data: {
                room
            }
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

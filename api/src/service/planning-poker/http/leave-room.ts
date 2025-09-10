import { Request } from 'express';
import { DefaultResponse, Room } from '../../../models';
import { handleError } from '../../../helpers';
import { getRoomDetails, leaveRoomByRoomId, sendPlayersToClients } from '../methods';

export const leaveRoom = async (req: Request): Promise<DefaultResponse> => {
    try {
        const roomId: string = req.body.roomId;
        if (roomId == null || (req.userId == null && req.guestSessionId == null)) {
            return {
                code: 400,
                success: false,
                message: 'Invalid request'
            };
        }
        await leaveRoomByRoomId(roomId, req.userId, req.guestSessionId);
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
            code: 200
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

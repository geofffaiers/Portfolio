import { Request } from "express";
import { DefaultResponse, GetRoom, Room } from "../../../models";
import { handleError } from "../../../helpers";
import { getRoomDetails, joinRoomByRoomId, sendPlayersToClients } from "../methods";

export const joinRoom = async (req: Request): Promise<DefaultResponse<GetRoom>> => {
    try {
        const roomId: string | undefined = req.query.roomId
            ? String(req.query.roomId)
            : undefined;
        if (roomId == null) {
            return {
                code: 400,
                success: false,
                message: 'No room id provided'
            }
        }
        if (req.userId == null) {
            return {
                code: 400,
                success: false,
                message: 'User not found'
            };
        }
        await joinRoomByRoomId(roomId, req.userId);
        const room: Room | undefined = await getRoomDetails(roomId);
        if (room == null) {
            return {
                code: 400,
                success: false,
                message: 'Room not found'
            }
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

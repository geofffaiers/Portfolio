import { Request } from "express";
import { DefaultResponse } from "../../../models";
import { handleError } from "../../../helpers";
import { sendRoomToClients, validateThenUpdateRoom } from "../methods";

export const updateRoom = async (req: Request): Promise<DefaultResponse> => {
    try {
        if (req.userId == null) {
            return {
                code: 400,
                success: false,
                message: 'User not found'
            };
        }
        const room = await validateThenUpdateRoom(
            req.userId,
            req.body.roomId,
            req.body.name,
            req.body.description,
            req.body.updatedPlayers,
            req.body.removedPlayers,
        );
        await sendRoomToClients(room.id, room);
        return {
            success: true,
            code: 200
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

import { Request } from "express";
import { CreateRoom, DefaultResponse, Room } from "../../../models";
import { handleError } from "../../../helpers";
import { saveRoomToDb } from "../methods";

export const createRoom = async (req: Request): Promise<DefaultResponse<CreateRoom>> => {
    try {
        if (req.userId == null) {
            return {
                code: 400,
                success: false,
                message: 'User not found'
            };
        }
        const room = new Room();
        room.name = req.body.name;
        room.description = req.body.description;
        room.createdAt = new Date();
        room.updatedAt = new Date();
        return {
            success: true,
            code: 200,
            data: {
                room: await saveRoomToDb(room, req.userId),
            }
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

import { Request } from 'express';
import { DefaultResponse, GetRooms } from '../../../models';
import { handleError } from '../../../helpers';
import { getRoomsFromDbForUser } from '../methods';

export const getRooms = async (req: Request): Promise<DefaultResponse<GetRooms>> => {
    try {
        if (req.userId == null) {
            return {
                code: 400,
                success: false,
                message: 'User not found'
            };
        }
        return {
            success: true,
            code: 200,
            data: {
                rooms: await getRoomsFromDbForUser(req.userId)
            }
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

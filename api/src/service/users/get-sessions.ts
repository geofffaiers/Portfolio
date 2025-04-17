
import { Request } from 'express';
import { handleError } from '../../helpers';
import { DefaultResponse, GetSessions } from '../../models';
import { getCurrentSessions } from './methods';

export const getSessions = async (req: Request): Promise<DefaultResponse<GetSessions>> => {
    try {
        const userId: number | undefined = req.userId;
        if (userId == null) {
            return {
                code: 400,
                success: false,
                message: 'Not logged in'
            };
        }

        return {
            code: 200,
            success: true,
            data: {
                sessions: await getCurrentSessions(req, userId)
            }
        };
    } catch (err: unknown) {
        return handleError<GetSessions>(err);
    }
};

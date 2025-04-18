import { Request } from 'express';
import { handleError, pool, sendContactEmail } from '../../../helpers';
import { DefaultResponse } from '../../../models';

export const contact = async (req: Request): Promise<DefaultResponse> => {
    try {
        const { name, email, message } = req.body;
        if (name == null || email == null || message == null) {
            return {
                code: 400,
                success: false,
                message: 'Missing required fields.'
            };
        }
        await pool.query(
            'INSERT INTO contact_form (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        await sendContactEmail(name, message);
        return {
            code: 200,
            success: true
        };
    } catch (err: unknown) {
        return handleError(err);
    }
};

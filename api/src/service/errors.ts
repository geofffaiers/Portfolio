import { logError } from '../helpers';
import { DefaultResponse } from '../models/responses/default-response';

export const defaultError = (error: Error): DefaultResponse => {
    logError(error);
    return {
        code: 500,
        success: false,
        message: error.message.replaceAll('Error: ', ''),
        stack: error.stack
    };
};

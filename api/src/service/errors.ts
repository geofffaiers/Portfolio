import { RequestError } from '@src/models/request-error';
import { logError } from '../helpers';
import { DefaultResponse } from '../models/responses/default-response';

export const defaultError = (error: RequestError): DefaultResponse => {
    logError(error);
    return {
        code: error.status || 500,
        success: false,
        message: error.message.replaceAll('Error: ', ''),
        stack: error.stack
    };
};

import { NextFunction, Request, Response } from 'express';
import { contact, getChatHeaders, getMessagesForPage } from '../service/messaging';
import { ChatHeader, DefaultResponse, Message } from '../models';
import { handleRoutingError } from '../helpers';

export default class MessagingController {
    async contact (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse = await contact(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async getChatHeaders (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<ChatHeader[]> = await getChatHeaders(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }

    async getMessagesForPage (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: DefaultResponse<Message[]> = await getMessagesForPage(req);
            res.status(response.code).json(response);
        } catch (err: unknown) {
            handleRoutingError(err, next);
        }
    }
}

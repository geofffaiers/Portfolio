import MessagingController from '@src/controllers/messaging';
import * as messagingService from '@src/service/messaging';
import * as helpers from '@src/helpers';
import { ChatHeader, DefaultResponse, Message } from '@src/models';
import { getMockRequestResponse, NextFunction, Request, Response } from '@mocks/express';
import { mockReceivedMessage, mockSentMessage, mockUser1 } from '@mocks/models';

jest.mock('@src/service/messaging');
jest.mock('@src/helpers');

describe('MessagingController', () => {
    let messagingController: MessagingController;
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
        messagingController = new MessagingController();
        const mocks = getMockRequestResponse();
        mockRequest = mocks.mockRequest;
        mockResponse = mocks.mockResponse;
        mockNext = mocks.mockNext;
    });

    describe('contact', () => {
        it('should return response when service call succeeds', async () => {
            const mockServiceResponse: DefaultResponse = {
                code: 200,
                success: true
            };
            jest.spyOn(messagingService, 'contact').mockResolvedValue(mockServiceResponse);

            await messagingController.contact(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(messagingService.contact).toHaveBeenCalledWith(mockRequest);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call handleRoutingError when service throws an error', async () => {
            const mockError = new Error('Service failure');
            jest.spyOn(messagingService, 'contact').mockRejectedValue(mockError);

            await messagingController.contact(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(messagingService.contact).toHaveBeenCalledWith(mockRequest);
            expect(helpers.handleRoutingError).toHaveBeenCalledWith(mockError, mockNext);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });

    describe('getChatHeaders', () => {
        it('should return chat headers when service call succeeds', async () => {
            const mockHeaders: ChatHeader[] = [
                {
                    user: mockUser1(),
                    lastMessage: mockSentMessage(),
                    lastReceivedMessage: mockReceivedMessage()
                }
            ];
            const mockServiceResponse: DefaultResponse<ChatHeader[]> = {
                code: 200,
                success: true,
                data: mockHeaders
            };
            jest.spyOn(messagingService, 'getChatHeaders').mockResolvedValue(mockServiceResponse);

            await messagingController.getChatHeaders(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(messagingService.getChatHeaders).toHaveBeenCalledWith(mockRequest);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call handleRoutingError when service throws an error', async () => {
            const mockError = new Error('Service failure');
            jest.spyOn(messagingService, 'getChatHeaders').mockRejectedValue(mockError);

            await messagingController.getChatHeaders(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(messagingService.getChatHeaders).toHaveBeenCalledWith(mockRequest);
            expect(helpers.handleRoutingError).toHaveBeenCalledWith(mockError, mockNext);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });

    describe('getMessagesForPage', () => {
        it('should return messages when service call succeeds', async () => {
            const mockMessages: Message[] = [
                mockSentMessage(),
                mockReceivedMessage()
            ];
            const mockServiceResponse: DefaultResponse<Message[]> = {
                code: 200,
                success: true,
                data: mockMessages
            };
            jest.spyOn(messagingService, 'getMessagesForPage').mockResolvedValue(mockServiceResponse);

            await messagingController.getMessagesForPage(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(messagingService.getMessagesForPage).toHaveBeenCalledWith(mockRequest);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call handleRoutingError when service throws an error', async () => {
            const mockError = new Error('Service failure');
            jest.spyOn(messagingService, 'getMessagesForPage').mockRejectedValue(mockError);

            await messagingController.getMessagesForPage(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(messagingService.getMessagesForPage).toHaveBeenCalledWith(mockRequest);
            expect(helpers.handleRoutingError).toHaveBeenCalledWith(mockError, mockNext);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });
});

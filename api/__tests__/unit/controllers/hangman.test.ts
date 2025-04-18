import HangmanController from '@src/controllers/hangman';
import * as hangmanService from '@src/service/hangman';
import * as helpers from '@src/helpers';
import { WordWithData } from '@src/models';
import { getMockRequestResponse, NextFunction, Request, Response } from '@mocks/express';

jest.mock('@src/service/hangman');
jest.mock('@src/helpers');

describe('HangmanController', () => {
    let hangmanController: HangmanController;
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
        hangmanController = new HangmanController();
        const mocks = getMockRequestResponse();
        mockRequest = mocks.mockRequest;
        mockResponse = mocks.mockResponse;
        mockNext = mocks.mockNext;
    });

    describe('getWord', () => {
        it('should return word data when service call succeeds', async () => {
            const mockWordData: WordWithData = {
                word: 'example',
            };

            const mockServiceResponse = {
                code: 200,
                success: true,
                data: mockWordData
            };
            jest.spyOn(hangmanService, 'getWord').mockResolvedValue(mockServiceResponse);

            await hangmanController.getWord(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(hangmanService.getWord).toHaveBeenCalledWith(mockRequest);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call handleRoutingError when service throws an error', async () => {
            const mockError = new Error('Service failure');
            jest.spyOn(hangmanService, 'getWord').mockRejectedValue(mockError);

            await hangmanController.getWord(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(hangmanService.getWord).toHaveBeenCalledWith(mockRequest);
            expect(helpers.handleRoutingError).toHaveBeenCalledWith(mockError, mockNext);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });
});

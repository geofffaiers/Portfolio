import ScoresController from '@src/controllers/scores';
import * as scoresService from '@src/service/scores';
import * as helpers from '@src/helpers';
import { DefaultResponse, GetScores, SaveScores } from '@src/models';
import { getMockRequestResponse, NextFunction, Request, Response } from '@mocks/express';

jest.mock('@src/service/scores');
jest.mock('@src/helpers');

describe('ScoresController', () => {
    let controller: ScoresController;
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
        controller = new ScoresController();
        const mocks = getMockRequestResponse();
        mockRequest = mocks.mockRequest;
        mockResponse = mocks.mockResponse;
        mockNext = mocks.mockNext;
    });

    describe('saveScores', () => {
        it('should return response when saveScores succeeds', async () => {
            const mockServiceResponse: DefaultResponse<SaveScores> = {
                code: 201,
                success: true,
                data: {} as SaveScores
            };
            (scoresService.saveScores as jest.Mock).mockResolvedValue(mockServiceResponse);

            await controller.saveScores(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(scoresService.saveScores).toHaveBeenCalledWith(mockRequest);
            expect(mockResponse.status).toHaveBeenCalledWith(mockServiceResponse.code);
            expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call handleRoutingError when saveScores throws', async () => {
            const mockError = new Error('Service failure');
            (scoresService.saveScores as jest.Mock).mockRejectedValue(mockError);

            await controller.saveScores(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(scoresService.saveScores).toHaveBeenCalledWith(mockRequest);
            expect(helpers.handleRoutingError).toHaveBeenCalledWith(mockError, mockNext);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });

    describe('getScores', () => {
        it('should return response when getScores succeeds', async () => {
            const mockServiceResponse: DefaultResponse<GetScores> = {
                code: 200,
                success: true,
                data: {} as GetScores
            };
            (scoresService.getScores as jest.Mock).mockResolvedValue(mockServiceResponse);

            await controller.getScores(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(scoresService.getScores).toHaveBeenCalledWith(mockRequest);
            expect(mockResponse.status).toHaveBeenCalledWith(mockServiceResponse.code);
            expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call handleRoutingError when getScores throws', async () => {
            const mockError = new Error('Service failure');
            (scoresService.getScores as jest.Mock).mockRejectedValue(mockError);

            await controller.getScores(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(scoresService.getScores).toHaveBeenCalledWith(mockRequest);
            expect(helpers.handleRoutingError).toHaveBeenCalledWith(mockError, mockNext);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });
});

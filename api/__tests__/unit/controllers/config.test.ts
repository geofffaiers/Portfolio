import ConfigController from '@src/controllers/config';
import * as configService from '@src/service/config';
import * as helpers from '@src/helpers';
import { ConfigResponse } from '@src/models';
import { getMockRequestResponse, NextFunction, Request, Response } from '@mocks/express';

jest.mock('@src/service/config');
jest.mock('@src/helpers');

describe('ConfigController', () => {
    let configController: ConfigController;
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
        configController = new ConfigController();
        const mocks = getMockRequestResponse();
        mockRequest = mocks.mockRequest;
        mockResponse = mocks.mockResponse;
        mockNext = mocks.mockNext;
    });

    describe('getConfig', () => {
        it('should return configuration when service call succeeds', async () => {
            const mockConfigData: ConfigResponse = {
                projects: [],
            };

            const mockServiceResponse = {
                code: 200,
                success: true,
                data: mockConfigData
            };
            jest.spyOn(configService, 'getConfig').mockResolvedValue(mockServiceResponse);

            await configController.getConfig(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(configService.getConfig).toHaveBeenCalledWith(mockRequest);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should call handleRoutingError when service throws an error', async () => {
            const mockError = new Error('Service failure');
            jest.spyOn(configService, 'getConfig').mockRejectedValue(mockError);

            await configController.getConfig(
                mockRequest,
                mockResponse,
                mockNext
            );

            expect(configService.getConfig).toHaveBeenCalledWith(mockRequest);
            expect(helpers.handleRoutingError).toHaveBeenCalledWith(mockError, mockNext);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });
});

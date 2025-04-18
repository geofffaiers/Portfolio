import PlanningPokerController from '@src/controllers/planning-poker';
import * as planningPokerService from '@src/service/planning-poker';
import * as helpers from '@src/helpers';
import { CreateRoom, GetRoom, GetRooms } from '@src/models';
import { getMockRequestResponse, NextFunction, Request, Response } from '@mocks/express';
import { TestCase } from '@tests/types/test-case';

jest.mock('@src/service/planning-poker');
jest.mock('@src/helpers');

const testCases: TestCase<PlanningPokerController, typeof planningPokerService>[] = [
    { method: 'getRooms', service: 'getRooms', response: { code: 200, success: true, data: {} as GetRooms } },
    { method: 'getRoom', service: 'getRoom', response: { code: 200, success: true, data: {} as GetRoom } },
    { method: 'joinRoom', service: 'joinRoom', response: { code: 200, success: true, data: {} as GetRoom } },
    { method: 'createRoom', service: 'createRoom', response: { code: 201, success: true, data: {} as CreateRoom } },
    { method: 'createGame', service: 'createGame', response: { code: 201, success: true, data: {} } },
    { method: 'disconnect', service: 'disconnect', response: { code: 200, success: true, data: {} } },
    { method: 'endRound', service: 'endRound', response: { code: 200, success: true, data: {} } },
    { method: 'newRound', service: 'newRound', response: { code: 200, success: true, data: {} } },
    { method: 'endGame', service: 'endGame', response: { code: 200, success: true, data: {} } },
    { method: 'updateRoom', service: 'updateRoom', response: { code: 200, success: true, data: {} } }
];

describe('PlanningPokerController', () => {
    let controller: PlanningPokerController;
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
        controller = new PlanningPokerController();
        const mocks = getMockRequestResponse();
        mockRequest = mocks.mockRequest;
        mockResponse = mocks.mockResponse;
        mockNext = mocks.mockNext;
    });

    describe.each(testCases)(
        '$method',
        ({ method, service, response }) => {
            it(`should return response when ${service} succeeds`, async () => {
                (planningPokerService[service] as jest.Mock).mockResolvedValue(response);

                await (controller[method] as (req: Request, res: Response, next: NextFunction) => Promise<void>)(
                    mockRequest,
                    mockResponse,
                    mockNext
                );

                expect(planningPokerService[service]).toHaveBeenCalledWith(mockRequest);
                expect(mockResponse.status).toHaveBeenCalledWith(response.code);
                expect(mockResponse.json).toHaveBeenCalledWith(response);
                expect(mockNext).not.toHaveBeenCalled();
            });

            it(`should call handleRoutingError when ${service} throws`, async () => {
                const mockError = new Error('Service failure');
                (planningPokerService[service] as jest.Mock).mockRejectedValue(mockError);

                await (controller[method] as (req: Request, res: Response, next: NextFunction) => Promise<void>)(
                    mockRequest,
                    mockResponse,
                    mockNext
                );

                expect(planningPokerService[service]).toHaveBeenCalledWith(mockRequest);
                expect(helpers.handleRoutingError).toHaveBeenCalledWith(mockError, mockNext);
                expect(mockResponse.status).not.toHaveBeenCalled();
                expect(mockResponse.json).not.toHaveBeenCalled();
            });
        }
    );
});

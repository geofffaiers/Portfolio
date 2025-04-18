import UsersController from '@src/controllers/users';
import * as usersService from '@src/service/users';
import * as helpers from '@src/helpers';
import { GetSessions, User } from '@src/models';
import { getMockRequestResponse, NextFunction, Request, Response } from '@mocks/express';
import { TestCase } from '@tests/types/test-case';

jest.mock('@src/service/users');
jest.mock('@src/helpers');

const testCases: TestCase<UsersController, typeof usersService>[] = [
    { method: 'create', service: 'create', response: { code: 201, success: true, data: {} as User } },
    { method: 'generateResetToken', service: 'generateResetToken', response: { code: 200, success: true, data: {} } },
    { method: 'getUserForResetToken', service: 'getUserForResetToken', response: { code: 200, success: true, data: {} as User } },
    { method: 'getUserForValidateToken', service: 'getUserForValidateToken', response: { code: 200, success: true, data: {} as User } },
    { method: 'login', service: 'login', response: { code: 200, success: true, data: {} as User }, passRes: true },
    { method: 'logout', service: 'logout', response: { code: 200, success: true, data: {} }, passRes: true },
    { method: 'refreshToken', service: 'refreshToken', response: { code: 200, success: true, data: {} }, passRes: true },
    { method: 'resetPassword', service: 'resetPassword', response: { code: 200, success: true, data: {} } },
    { method: 'update', service: 'update', response: { code: 200, success: true, data: {} as User } },
    { method: 'del', service: 'del', response: { code: 200, success: true, data: {} } },
    { method: 'validateEmail', service: 'validateEmail', response: { code: 200, success: true, data: {} } },
    { method: 'resendVerification', service: 'resendVerification', response: { code: 200, success: true, data: {} } },
    { method: 'getSessions', service: 'getSessions', response: { code: 200, success: true, data: {} as GetSessions } },
    { method: 'logoutSession', service: 'logoutSession', response: { code: 200, success: true, data: {} as GetSessions } }
];

describe('UsersController', () => {
    let controller: UsersController;
    let mockRequest: Request;
    let mockResponse: Response;
    let mockNext: NextFunction;

    beforeEach(() => {
        controller = new UsersController();
        const mocks = getMockRequestResponse();
        mockRequest = mocks.mockRequest;
        mockResponse = mocks.mockResponse;
        mockNext = mocks.mockNext;
    });

    describe.each(testCases)('$method', ({ method, service, response, passRes }) => {
        it(`should return response when ${service} succeeds`, async () => {
            (usersService[service] as jest.Mock).mockResolvedValue(response);

            if (passRes) {
                await (controller[method] as (req: Request, res: Response, next: NextFunction) => Promise<void>)(
                    mockRequest,
                    mockResponse,
                    mockNext
                );

                expect(usersService[service]).toHaveBeenCalledWith(mockRequest, mockResponse);
            } else {
                await (controller[method] as (req: Request, res: Response, next: NextFunction) => Promise<void>)(
                    mockRequest,
                    mockResponse,
                    mockNext
                );

                expect(usersService[service]).toHaveBeenCalledWith(mockRequest);
            }
            expect(mockResponse.status).toHaveBeenCalledWith(response.code);
            expect(mockResponse.json).toHaveBeenCalledWith(response);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it(`should call handleRoutingError when ${service} throws`, async () => {
            const mockError = new Error('Service failure');
            (usersService[service] as jest.Mock).mockRejectedValue(mockError);

            if (passRes) {
                await (controller[method] as (req: Request, res: Response, next: NextFunction) => Promise<void>)(
                    mockRequest,
                    mockResponse,
                    mockNext
                );

                expect(usersService[service]).toHaveBeenCalledWith(mockRequest, mockResponse);
            } else {
                await (controller[method] as (req: Request, res: Response, next: NextFunction) => Promise<void>)(
                    mockRequest,
                    mockResponse,
                    mockNext
                );
                expect(usersService[service]).toHaveBeenCalledWith(mockRequest);
            }
            expect(helpers.handleRoutingError).toHaveBeenCalledWith(mockError, mockNext);
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.json).not.toHaveBeenCalled();
        });
    });
});

import { setPoolImpl } from '@mocks/helpers/db';
import { authenticateToken, authenticateTokenForSocket } from '@src/middlewares/authenticate-token';
import { JWTPayload, jwtVerify } from 'jose';
import { logError } from '@src/helpers';
import crypto from 'node:crypto';
import { WebSocket } from 'ws';
import { createMockRequest, createMockResponse, createMockNext } from '@mocks/express';

jest.mock('jose');
jest.mock('crypto');
jest.mock('ws');
jest.mock('@src/helpers/errors', () => ({
    logError: jest.fn()
}));

const mockJwtVerify = jwtVerify as jest.Mock;
const query = jest.fn();
setPoolImpl({
    query
});
describe('authenticateToken', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'testsecret';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 when token is missing', async () => {
        const req = createMockRequest();
        req.cookies.token = undefined;
        req.cookies.refreshToken = 'refresh';
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: 401,
            success: false,
            message: 'Unauthorized'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is not a string', async () => {
        const req = createMockRequest();
        req.cookies.token = 123 as unknown as string;
        req.cookies.refreshToken = 'refresh';
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: 401,
            success: false,
            message: 'Unauthorized'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when refreshToken is missing', async () => {
        mockJwtVerify.mockResolvedValue({ payload: { userId: 1 } } as { payload: JWTPayload });
        const req = createMockRequest();
        req.cookies.token = 'token';
        req.cookies.refreshToken = undefined;
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateToken(req, res, next);

        expect(res.clearCookie).toHaveBeenCalledWith('token');
        expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: 401,
            success: false,
            message: 'Invalid session'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when session is not found', async () => {
        mockJwtVerify.mockResolvedValue({ payload: { userId: 1 } } as { payload: JWTPayload });
        (crypto.createHash as jest.Mock).mockReturnValue({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue('hashed')
        });
        query.mockResolvedValue([[]]);

        const req = createMockRequest();
        req.cookies.token = 'token';
        req.cookies.refreshToken = 'refresh';
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateToken(req, res, next);

        expect(query).toHaveBeenCalled();
        expect(res.clearCookie).toHaveBeenCalledWith('token');
        expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: 401,
            success: false,
            message: 'Invalid session'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should set req.userId and call next when session is valid', async () => {
        mockJwtVerify.mockResolvedValue({ payload: { userId: 1 } } as { payload: JWTPayload });
        (crypto.createHash as jest.Mock).mockReturnValue({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue('hashed')
        });
        query.mockResolvedValue([[{ id: 1 }]]);

        const req = createMockRequest();
        req.cookies.token = 'token';
        req.cookies.refreshToken = 'refresh';
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateToken(req, res, next);

        expect(req.userId).toBe(1);
        expect(next).toHaveBeenCalled();
    });

    it('should return 403 when jwtVerify throws', async () => {
        mockJwtVerify.mockRejectedValue(new Error('fail'));
        const req = createMockRequest();
        req.cookies.token = 'token';
        req.cookies.refreshToken = 'refresh';
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateToken(req, res, next);

        expect(logError).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            code: 403,
            success: false,
            message: 'Forbidden'
        });
        expect(next).not.toHaveBeenCalled();
    });
});

describe('authenticateTokenForSocket', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'testsecret';
    });

    const createMockWs = () => {
        const ws = {} as WebSocket;
        ws.close = jest.fn();
        return ws;
    };

    it('should close ws with 1008 when token is missing', async () => {
        const ws = createMockWs();
        const req = createMockRequest();
        req.cookies.token = undefined;

        const result = await authenticateTokenForSocket(ws, req);

        expect(ws.close).toHaveBeenCalledWith(1008, 'Unauthorized');
        expect(result).toBe(-1);
    });

    it('should close ws with 1008 when refreshToken is missing', async () => {
        mockJwtVerify.mockResolvedValue({ payload: { userId: 1 } } as { payload: JWTPayload });
        const ws = createMockWs();
        const req = createMockRequest();
        req.cookies.token = 'token';
        req.cookies.refreshToken = undefined;

        const result = await authenticateTokenForSocket(ws, req);

        expect(ws.close).toHaveBeenCalledWith(1008, 'Invalid session');
        expect(result).toBe(-1);
    });

    it('should close ws with 1008 when session is not found', async () => {
        mockJwtVerify.mockResolvedValue({ payload: { userId: 1 } } as { payload: JWTPayload });
        (crypto.createHash as jest.Mock).mockReturnValue({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue('hashed')
        });
        query.mockResolvedValue([[]]);

        const ws = createMockWs();
        const req = createMockRequest();
        req.cookies.token = 'token';
        req.cookies.refreshToken = 'refresh';

        const result = await authenticateTokenForSocket(ws, req);

        expect(ws.close).toHaveBeenCalledWith(1008, 'Invalid session');
        expect(result).toBe(-1);
    });

    it('should return userId when session is valid', async () => {
        mockJwtVerify.mockResolvedValue({ payload: { userId: 1 } } as { payload: JWTPayload });
        (crypto.createHash as jest.Mock).mockReturnValue({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue('hashed')
        });
        query.mockResolvedValue([[{ id: 1 }]]);

        const ws = createMockWs();
        const req = createMockRequest();
        req.cookies.token = 'token';
        req.cookies.refreshToken = 'refresh';

        const result = await authenticateTokenForSocket(ws, req);

        expect(result).toBe(1);
    });

    it('should close ws with 1008 and return -1 when jwtVerify throws', async () => {
        mockJwtVerify.mockRejectedValue(new Error('fail'));
        const ws = createMockWs();
        const req = createMockRequest();
        req.cookies.token = 'token';
        req.cookies.refreshToken = 'refresh';

        const result = await authenticateTokenForSocket(ws, req);

        expect(logError).toHaveBeenCalled();
        expect(ws.close).toHaveBeenCalledWith(1008, 'Forbidden');
        expect(result).toBe(-1);
    });
});

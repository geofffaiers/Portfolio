import { setPoolImpl } from '@mocks/helpers/db';
import { authenticateGuestOrUser, authenticateToken, socketAuthentication } from '@src/middlewares/authenticate-token';
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

describe('authenticateGuestOrUser', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'testsecret';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        undefined,
        123
    ])('should return 401 when guestSessionToken is %s', async (guestSessionToken) => {
        const req = createMockRequest();
        req.cookies.guestSessionToken = guestSessionToken;
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateGuestOrUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: 401,
            success: false,
            message: 'Unauthorized'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when session is not found', async () => {
        mockJwtVerify.mockResolvedValue({ payload: { guestSessionId: 1 } } as { payload: JWTPayload });
        (crypto.createHash as jest.Mock).mockReturnValue({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue('hashed')
        });
        query.mockResolvedValue([[]]);

        const req = createMockRequest();
        req.cookies.guestSessionToken = 'guestSessionToken';
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateGuestOrUser(req, res, next);

        expect(query).toHaveBeenCalled();
        expect(res.clearCookie).toHaveBeenCalledWith('guestSessionToken');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: 401,
            success: false,
            message: 'Invalid session'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should set req.guestSessionId to undefined if user authentication is included', async () => {
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

        await authenticateGuestOrUser(req, res, next);

        expect(req.guestSessionId).toBeUndefined();
        expect(req.userId).toBe(1);
        expect(next).toHaveBeenCalled();
    });

    it('should set req.guestSessionId and call next when session is valid', async () => {
        mockJwtVerify.mockResolvedValue({ payload: { guestSessionId: 1 } } as { payload: JWTPayload });
        (crypto.createHash as jest.Mock).mockReturnValue({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue('hashed')
        });
        query.mockResolvedValue([[{ id: 1 }]]);

        const req = createMockRequest();
        req.cookies.guestSessionToken = 'guestSessionToken';
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateGuestOrUser(req, res, next);

        expect(req.guestSessionId).toBe(1);
        expect(next).toHaveBeenCalled();
    });

    it('should clear guestSessionToken cookie and return 401 when guestSessionToken is not found', async () => {
        mockJwtVerify.mockResolvedValue({ payload: { userId: 1 } } as { payload: JWTPayload });
        const req = createMockRequest();
        req.cookies.guestSessionToken = 'guestSessionToken';
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateGuestOrUser(req, res, next);

        expect(res.clearCookie).toHaveBeenCalledWith('guestSessionToken');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            code: 401,
            success: false,
            message: 'Invalid session'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when jwtVerify throws', async () => {
        mockJwtVerify.mockRejectedValue(new Error('fail'));
        const req = createMockRequest();
        req.cookies.guestSessionToken = 'guestSessionToken';
        const res = createMockResponse();
        const next = createMockNext();

        await authenticateGuestOrUser(req, res, next);

        expect(logError).toHaveBeenCalled();
        expect(res.clearCookie).toHaveBeenCalledWith('guestSessionToken');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            code: 403,
            success: false,
            message: 'Forbidden'
        });
        expect(next).not.toHaveBeenCalled();
    });
});

describe('authenticateToken', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'testsecret';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        {
            guestSessionId: undefined,
            token: undefined
        },
        {
            guestSessionId: undefined,
            token: null
        },
        {
            guestSessionId: undefined,
            token: 123 as unknown as string
        },
        {
            guestSessionId: 'guestSessionId',
            token: 'token'
        }
    ])('should return 401 when token is $token', async ({ guestSessionId, token }) => {
        const req = createMockRequest();
        req.cookies.token = token;
        req.guestSessionId = guestSessionId;
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

describe('socketAuthentication', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'testsecret';
    });

    const createMockWs = () => {
        const ws = {} as WebSocket;
        ws.close = jest.fn();
        return ws;
    };

    it.each([
        {
            token: null,
            guestSessionToken: null,
            cookie: undefined
        },
        {
            token: undefined,
            guestSessionToken: undefined,
            cookie: 'someOtherCookie=X;anotherCookie=Y'
        }
    ])('should close ws with 1008 when token is missing', async ({ token, guestSessionToken, cookie }) => {
        const ws = createMockWs();
        const req = createMockRequest();
        req.cookies.token = token;
        req.cookies.guestSessionToken = guestSessionToken;
        req.headers.cookie = cookie;

        const result = await socketAuthentication(ws, req);

        expect(ws.close).toHaveBeenCalledWith(1008, 'Unauthorized');
        expect(result).toStrictEqual([null, null]);
    });

    describe('Socket user authentication', () => {
        it('should close ws with 1008 when refreshToken is missing', async () => {
            mockJwtVerify.mockResolvedValue({ payload: { userId: 1 } } as { payload: JWTPayload });
            const ws = createMockWs();
            const req = createMockRequest();
            req.cookies.token = 'token';
            req.cookies.refreshToken = undefined;

            const result = await socketAuthentication(ws, req);

            expect(ws.close).toHaveBeenCalledWith(1008, 'Invalid session');
            expect(result).toStrictEqual([null, null]);
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

            const result = await socketAuthentication(ws, req);

            expect(ws.close).toHaveBeenCalledWith(1008, 'Invalid session');
            expect(result).toStrictEqual([null, null]);
        });

        it.each([
            {
                token: 'token',
                refreshToken: 'refresh',
                cookie: undefined
            },
            {
                token: undefined,
                refreshToken: undefined,
                cookie: 'token=token;refreshToken=refresh'
            }
        ])('should return userId when session is valid', async ({ token, refreshToken, cookie }) => {
            mockJwtVerify.mockResolvedValue({ payload: { userId: 1 } } as { payload: JWTPayload });
            (crypto.createHash as jest.Mock).mockReturnValue({
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValue('hashed')
            });
            query.mockResolvedValue([[{ id: 1 }]]);

            const ws = createMockWs();
            const req = createMockRequest();
            req.cookies.token = token;
            req.cookies.refreshToken = refreshToken;
            req.headers.cookie = cookie;

            const result = await socketAuthentication(ws, req);

            expect(result).toStrictEqual([1, null]);
        });

        it('should close ws with 1008 and return null when jwtVerify throws', async () => {
            mockJwtVerify.mockRejectedValue(new Error('fail'));
            const ws = createMockWs();
            const req = createMockRequest();
            req.cookies.token = 'token';
            req.cookies.refreshToken = 'refresh';

            const result = await socketAuthentication(ws, req);

            expect(logError).toHaveBeenCalled();
            expect(ws.close).toHaveBeenCalledWith(1008, 'Forbidden');
            expect(result).toStrictEqual([null, null]);
        });
    });

    describe('Socket guest authentication', () => {
        it('should close ws with 1008 when session is not found', async () => {
            mockJwtVerify.mockResolvedValue({ payload: { guestSessionId: 1 } } as { payload: JWTPayload });
            (crypto.createHash as jest.Mock).mockReturnValue({
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValue('hashed')
            });
            query.mockResolvedValue([[]]);

            const ws = createMockWs();
            const req = createMockRequest();
            req.cookies.guestSessionToken = 'guestSessionToken';

            const result = await socketAuthentication(ws, req);

            expect(ws.close).toHaveBeenCalledWith(1008, 'Invalid session');
            expect(result).toStrictEqual([null, null]);
        });

        it.each([
            {
                guestSessionToken: 'guestSessionToken',
                cookie: undefined
            },
            {
                guestSessionToken: undefined,
                cookie: 'guestSessionToken=guestSessionToken'
            }
        ])('should return guestSessionId when session is valid', async ({ guestSessionToken, cookie }) => {
            mockJwtVerify.mockResolvedValue({ payload: { guestSessionId: 1 } } as { payload: JWTPayload });
            (crypto.createHash as jest.Mock).mockReturnValue({
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValue('hashed')
            });
            query.mockResolvedValue([[{ id: 1 }]]);

            const ws = createMockWs();
            const req = createMockRequest();
            req.cookies.guestSessionToken = guestSessionToken;
            req.headers.cookie = cookie;

            const result = await socketAuthentication(ws, req);

            expect(result).toStrictEqual([null, 1]);
        });

        it('should close ws with 1008 and return null when jwtVerify throws', async () => {
            mockJwtVerify.mockRejectedValue(new Error('fail'));
            const ws = createMockWs();
            const req = createMockRequest();
            req.cookies.guestSessionToken = 'guestSessionToken';

            const result = await socketAuthentication(ws, req);

            expect(logError).toHaveBeenCalled();
            expect(ws.close).toHaveBeenCalledWith(1008, 'Forbidden');
            expect(result).toStrictEqual([null, null]);
        });
    });
});

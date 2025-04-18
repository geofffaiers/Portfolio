import { NextFunction, Request, Response } from 'express';
import { jest } from '@jest/globals';

export { NextFunction, Request, Response } from 'express';

export const createMockRequest = (): Request => ({
    body: {},
    params: {},
    query: {},
    cookies: {},
    headers: {},
    method: '',
    url: '',
    originalUrl: '',
    ip: '127.0.0.1'
} as unknown as Request);

export const createMockResponse = (): Response => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res) as unknown as Response['status'];
    res.json = jest.fn().mockReturnValue(res) as unknown as Response['json'];
    res.send = jest.fn().mockReturnValue(res) as unknown as Response['send'];
    res.end = jest.fn().mockReturnValue(res) as unknown as Response['end'];
    res.redirect = jest.fn().mockReturnValue(res) as unknown as Response['redirect'];
    res.setHeader = jest.fn().mockReturnValue(res) as unknown as Response['setHeader'];
    res.getHeader = jest.fn() as unknown as Response['getHeader'];
    res.clearCookie = jest.fn().mockReturnValue(res) as unknown as Response['clearCookie'];
    res.cookie = jest.fn().mockReturnValue(res) as unknown as Response['cookie'];
    res.append = jest.fn().mockReturnValue(res) as unknown as Response['append'];
    res.location = jest.fn().mockReturnValue(res) as unknown as Response['location'];

    return res as unknown as Response;
};

export const createMockNext = (): NextFunction =>
  jest.fn() as unknown as NextFunction;

export const getMockRequestResponse = () => {
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();
    const mockNext = createMockNext();

    return { mockRequest, mockResponse, mockNext };
};

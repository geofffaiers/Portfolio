import { pool } from '@mocks/helpers/db';
import * as errorsHelper from '@src/helpers/errors';

describe('errors helper', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

  describe('handleRoutingError', () => {
    it('should call next with the error if err is an Error instance', () => {
      const err = new Error('test error');
      const next = jest.fn();

      errorsHelper.handleRoutingError(err, next);

      expect(next).toHaveBeenCalledWith(err);
    });

    it('should call next with a new Error if err is not an Error instance', () => {
      const err = { foo: 'bar' };
      const next = jest.fn();

      errorsHelper.handleRoutingError(err, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect((next.mock.calls[0][0] as Error).message).toContain('An unexpected error occurred');
    });
  });

  describe('reportError', () => {
    it('should call pool.query with the error message', async () => {
      const err = new Error('db error');

      await errorsHelper.reportError(err);

      expect(pool.query).toHaveBeenCalledWith('INSERT INTO errors (message) VALUES (?)', [err.message]);
    });
  });

  describe('handleError', () => {
    it('should log and return DefaultResponse if err is an Error', () => {
      const err = new Error('fail');
      const logSpy = jest.spyOn(errorsHelper, 'logError').mockImplementation();

      const result = errorsHelper.handleError(err);

      expect(logSpy).toHaveBeenCalledWith(err);
      expect(result).toEqual({
        code: 500,
        success: false,
        message: 'fail'
      });
    });

    it('should throw if err is not an Error', () => {
      expect(() => errorsHelper.handleError({ foo: 'bar' })).toThrow('An unexpected error occurred');
    });
  });

  describe('logError', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    it('should log error message and stack if err is an Error', () => {
      const err = new Error('fail');

      errorsHelper.logError(err);

      expect(consoleErrorSpy).toHaveBeenCalledWith('fail');
      expect(consoleErrorSpy).toHaveBeenCalledWith(err.stack);
    });

    it('should log stringified error if err is not an Error', () => {
      const err = { foo: 'bar' };

      errorsHelper.logError(err);

      expect(consoleErrorSpy).toHaveBeenCalledWith(JSON.stringify(err));
    });
  });
});
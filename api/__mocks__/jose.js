module.exports = {
  JWTPayload: {},
  jwtVerify: jest.fn().mockResolvedValue({ payload: {}, protectedHeader: {} }),
  compactDecrypt: jest.fn(),
  SignJWT: jest.fn()
};

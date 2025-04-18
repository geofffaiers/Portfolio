/* eslint-disable @typescript-eslint/no-require-imports */
describe('setupSwagger', () => {
    it('should set up swagger UI with the loaded document', () => {
        jest.resetModules();

        const useMock = jest.fn();
        const app: { use: jest.Mock } = { use: useMock };

        jest.doMock('path', () => ({
            join: jest.fn(() => '/fake/path/openapi.yml')
        }));
        jest.doMock('fs', () => ({
            readFileSync: jest.fn(() => 'openapi: 3.0.0')
        }));
        jest.doMock('js-yaml', () => ({
            load: jest.fn(() => ({ openapi: '3.0.0' }))
        }));
        jest.doMock('swagger-ui-express', () => ({
            serve: 'serve-mock',
            setup: jest.fn((doc: object) => `setup-mock-${JSON.stringify(doc)}`)
        }));

        const apiSpec = require('@src/helpers/api-specification');
        const swaggerUi = require('swagger-ui-express');

        apiSpec.setupSwagger(app);

        expect(app.use).toHaveBeenCalledWith(
            '/api-docs',
            swaggerUi.serve,
            swaggerUi.setup({ openapi: '3.0.0' })
        );
    });
});

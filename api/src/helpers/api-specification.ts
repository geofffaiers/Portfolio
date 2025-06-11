import swaggerUi, { JsonObject } from 'swagger-ui-express';
import { Application } from 'express';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import * as OpenApiValidator from 'express-openapi-validator';

const swaggerPath = path.join(__dirname, '../../openapi.yml');
const swaggerDocument: JsonObject | undefined = yaml.load(fs.readFileSync(swaggerPath, 'utf8')) as JsonObject | undefined;

export const setupSwagger = (app: Application): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(
        OpenApiValidator.middleware({
            apiSpec: swaggerPath,
            validateRequests: true,
            validateResponses: true
        }),
    );
};

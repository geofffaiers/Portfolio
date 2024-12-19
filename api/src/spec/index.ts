import swaggerUi from 'swagger-ui-express'
import { Application } from 'express'
import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'

const swaggerPath = path.join(__dirname, 'openapi.yml')
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8')) as Record<string, any>

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

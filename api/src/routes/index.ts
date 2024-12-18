import { Application } from 'express'
import usersRoutes from './users'
import messagingRoutes from './messaging'
import scoresRoutes from './scores'

export const router = (app: Application): void => {
  app.use('/api/users', usersRoutes)
  app.use('/api/messaging', messagingRoutes)
  app.use('/api/scores', scoresRoutes)
}

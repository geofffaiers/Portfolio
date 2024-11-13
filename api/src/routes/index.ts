import { Application } from 'express'
import usersRoutes from './users'

export const router = (app: Application): void => {
  // app.use('/rooms', roomsRoutes)
  app.use('/api/users', usersRoutes)
}

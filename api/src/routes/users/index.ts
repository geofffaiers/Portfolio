import { Router } from 'express'
import UsersController from '../../controllers/users'

const router: Router = Router()
const controller: UsersController = new UsersController()

router.post('/create', controller.create)
router.post('/login', controller.login)

export default router

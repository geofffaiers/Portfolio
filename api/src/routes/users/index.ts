import { Router } from 'express'
import UsersController from '../../controllers/users'
import { authenticateToken } from '../../middlewares'

const router: Router = Router()
const controller: UsersController = new UsersController()

router.post('/create', controller.create)
router.post('/generate-reset-token', controller.generateResetToken)
router.get('/get-user-for-reset-token', controller.getUserForResetToken)
router.post('/login', controller.login)
router.post('/reset-password', controller.resetPassword)
router.post('/refresh-token', controller.refreshToken)
router.post('/logout', authenticateToken, controller.logout)
router.post('/update', authenticateToken, controller.update)

export default router

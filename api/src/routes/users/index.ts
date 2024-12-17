import { Router } from 'express'
import UsersController from '../../controllers/users'
import { authenticateToken } from '../../middlewares'

const router: Router = Router()
const controller: UsersController = new UsersController()

router.post('/create', controller.create)
router.post('/generate-reset-token', controller.generateResetToken)
router.get('/get-user-for-reset-token', controller.getUserForResetToken)
router.get('/get-user-for-validate-token', controller.getUserForValidateToken)
router.post('/login', controller.login)
router.post('/reset-password', controller.resetPassword)
router.post('/refresh-token', controller.refreshToken)
router.post('/logout', authenticateToken, controller.logout)
router.post('/update', authenticateToken, controller.update)
router.delete('/delete', authenticateToken, controller.del)
router.post('/validate-email', controller.validateEmail)
router.post('/resend-verification', authenticateToken, controller.resendVerification)

export default router

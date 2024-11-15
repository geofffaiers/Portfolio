import { Router } from 'express'
import { authenticateToken } from '../../middlewares'
import MessagingController from '../../controllers/messaging'

const router: Router = Router()
const controller: MessagingController = new MessagingController()

router.get('/get-conversations', authenticateToken, controller.getConversations)

export default router

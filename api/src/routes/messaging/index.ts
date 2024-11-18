import { Router } from 'express'
import { authenticateToken } from '../../middlewares'
import MessagingController from '../../controllers/messaging'

const router: Router = Router()
const controller: MessagingController = new MessagingController()

router.get('/get-chat-headers', authenticateToken, controller.getChatHeaders)
router.get('/get-messages-for-page', authenticateToken, controller.getMessagesForPage)

export default router

import { Router } from 'express';
import UsersController from '../../controllers/users';
import { authenticateToken, limiter } from '../../middlewares';

const router: Router = Router();
const controller: UsersController = new UsersController();

router.post('/create', limiter(10), controller.create);
router.post('/generate-reset-token', controller.generateResetToken);
router.get('/sessions', limiter(50), authenticateToken, controller.getSessions);
router.post('/sessions/:sessionId', limiter(50), authenticateToken, controller.logoutSession);
router.get('/get-user-for-reset-token', controller.getUserForResetToken);
router.get('/get-user-for-validate-token', controller.getUserForValidateToken);
router.post('/login', limiter(50), controller.login);
router.post('/reset-password', limiter(10), controller.resetPassword);
router.post('/refresh-token', limiter(50), controller.refreshToken);
router.post('/logout', authenticateToken, controller.logout);
router.post('/update', limiter(50), authenticateToken, controller.update);
router.delete('/delete', limiter(10), authenticateToken, controller.del);
router.post('/validate-email', controller.validateEmail);
router.post('/resend-verification', limiter(10), authenticateToken, controller.resendVerification);

export default router;

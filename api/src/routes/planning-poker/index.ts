import { Router } from 'express';
import PlanningPokerController from '../../controllers/planning-poker';
import { authenticateToken } from '../../middlewares';

const router: Router = Router();
const controller: PlanningPokerController = new PlanningPokerController();

router.get('/rooms', authenticateToken, controller.getRooms);
router.get('/room', authenticateToken, controller.getRoom);
router.post('/rooms', authenticateToken, controller.createRoom);

export default router;

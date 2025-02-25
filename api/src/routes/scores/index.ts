import { Router } from 'express';
import { authenticateToken } from '../../middlewares';
import ScoresController from '../../controllers/scores';

const router: Router = Router();
const controller: ScoresController = new ScoresController();

router.post('/', authenticateToken, controller.saveScores);
router.get('/', controller.getScores);

export default router;

import express, { Router } from 'express';
import PlanningPokerController from '../../controllers/planning-poker';
import { authenticateToken } from '../../middlewares';

const router: Router = Router();
const controller: PlanningPokerController = new PlanningPokerController();

router.get('/rooms', authenticateToken, controller.getRooms);
router.get('/room', authenticateToken, controller.getRoom);
router.post('/rooms', authenticateToken, controller.createRoom);
router.post('/join-room', authenticateToken, controller.joinRoom);
router.post('/create-game', authenticateToken, controller.createGame);
router.post('/end-round', authenticateToken, controller.endRound);
router.post('/new-round', authenticateToken, controller.newRound);
router.post('/end-game', authenticateToken, controller.endGame);
router.post('/update-room', authenticateToken, controller.updateRoom);

// This doesn't need authenticate token as it's called by navigator.sendBeacon
router.post('/disconnect', express.text({ type: 'text/plain' }), controller.disconnect);

export default router;

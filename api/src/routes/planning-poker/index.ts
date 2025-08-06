import express, { Router } from 'express';
import PlanningPokerController from '../../controllers/planning-poker';
import { authenticateGuestOrUser, authenticateToken } from '../../middlewares';

const router: Router = Router();
const controller: PlanningPokerController = new PlanningPokerController();

router.post('/connect-guest', controller.connectGuest);
router.get('/rooms', authenticateGuestOrUser, controller.getRooms);
router.get('/room', authenticateGuestOrUser, controller.getRoom);
router.post('/rooms', authenticateToken, controller.createRoom);
router.post('/join-room', authenticateGuestOrUser, controller.joinRoom);
router.post('/create-game', authenticateToken, controller.createGame);
router.post('/end-round', authenticateToken, controller.endRound);
router.post('/new-round', authenticateToken, controller.newRound);
router.post('/end-game', authenticateToken, controller.endGame);
router.post('/update-room', authenticateToken, controller.updateRoom);

// This doesn't need authenticate token as it's called by navigator.sendBeacon
router.post('/disconnect', express.text({ type: 'text/plain' }), controller.disconnect);

export default router;

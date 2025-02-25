import { Router } from 'express';
import HangmanController from '../../controllers/hangman';

const router: Router = Router();
const controller: HangmanController = new HangmanController();

router.get('/word', controller.getWord);

export default router;

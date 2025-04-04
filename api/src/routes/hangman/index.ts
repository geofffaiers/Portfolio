import { Router } from 'express';
import HangmanController from '../../controllers/hangman';
import { limiter } from '../../helpers/rate-limiter';

const router: Router = Router();
const controller: HangmanController = new HangmanController();

router.get('/word', limiter(100), controller.getWord);

export default router;

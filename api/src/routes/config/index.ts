import { Router } from 'express';
import ConfigController from '../../controllers/config';

const router: Router = Router();
const controller: ConfigController = new ConfigController();

router.get('/', controller.getConfig);

export default router;

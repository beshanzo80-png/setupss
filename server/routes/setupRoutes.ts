import { Router } from 'express';
import { SetupController } from '../controllers/SetupController.js';

const router = Router();

router.get('/', SetupController.listSetups);
router.post('/', SetupController.createSetup);
router.get('/:id', SetupController.getSetup);
router.post('/:id/like', SetupController.likeSetup);

export const setupRoutes = router;

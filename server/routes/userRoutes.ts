import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

const router = Router();

router.get('/', UserController.listUsers);
router.get('/:id', UserController.getProfile);

export const userRoutes = router;

import { Router } from 'express';
import { HardwareController } from '../controllers/HardwareController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', HardwareController.listHardware);
router.get('/bottleneck', HardwareController.getBottleneck);
router.post('/ingest/buildcores', requireAdmin, HardwareController.ingestBuildCores);
router.post('/ingest/ai-search', HardwareController.ingestAiSearch);
router.get('/:slug', HardwareController.getBySlug);
router.get('/:slug/graph', HardwareController.getGraphData);

export const hardwareRoutes = router;

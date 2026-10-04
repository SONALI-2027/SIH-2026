import { Router } from 'express';
import { submitReport } from '../controllers/reportController';

const router = Router();

router.post('/', submitReport);

export default router;
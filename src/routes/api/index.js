import { Router } from 'express';
import accommodationRoutes from './accommodationRoutes';

const router = Router();

router.use('/accommodations', accommodationRoutes);

export default router;
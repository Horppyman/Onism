import express from 'express';
import index from './api';

const router = express.Router();

router.use('/api/v1/', index)

export default router;
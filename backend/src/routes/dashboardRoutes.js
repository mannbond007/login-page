import express from 'express';
import { getDashboardStats, getUserActivities } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/activities', protect, getUserActivities);

export default router;

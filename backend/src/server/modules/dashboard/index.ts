import { Router } from 'express';
import { getDashboardStats, getUserDashboardStats } from './get/index.js';

/**
 * Initialize dashboard routes
 * Prefix: /tags.
 */
export default (): Router => {
  const router = Router();

  router.get('/stats', getDashboardStats());
  router.get('/userStats', getUserDashboardStats());

  return router;
};

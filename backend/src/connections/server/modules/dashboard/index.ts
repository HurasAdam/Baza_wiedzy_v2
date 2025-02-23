import { Router } from 'express';
import getStats from './getStats/index.js';
import getUserStats from './getUserStats/index.js';

/**
 * Initialize dashboard routes
 * Prefix: /tags.
 */
export default (): Router => {
  const router = Router();

  router.get('/stats', getStats());
  router.get('/userStats', getUserStats());

  return router;
};

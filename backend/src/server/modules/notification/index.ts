import { Router } from 'express';
import getUserNotifications from './get/index.js';

/**
 * Initialize notifications routes
 * Prefix: /notifications.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getUserNotifications());

  return router;
};

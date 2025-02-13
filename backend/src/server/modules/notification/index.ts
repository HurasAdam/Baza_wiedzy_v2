import { Router } from 'express';
import getUserNotifications from './get/index.js';
import markNotificationAsRead from './put/index.js';

/**
 * Initialize notifications routes
 * Prefix: /notifications.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getUserNotifications());
  router.put('/:id/read', markNotificationAsRead());

  return router;
};

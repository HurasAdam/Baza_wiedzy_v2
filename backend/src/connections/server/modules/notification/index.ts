import { Router } from 'express';
import get from './get/index.js';
import read from './read/index.js';

/**
 * Initialize notifications routes
 * Prefix: /notifications.
 */
export default (): Router => {
  const router = Router();

  router.get('/', get());
  router.put('/:id/read', read());

  return router;
};

import { Router } from 'express';
import get from './get/index.js';
import remove from './remove/index.js';

/**
 * Initialize session routes
 * Prefix: /sessions.
 */
export default (): Router => {
  const router = Router();

  router.get('/', get());
  router.delete('/:id', remove());

  return router;
};

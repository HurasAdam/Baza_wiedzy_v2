import { Router } from 'express';
import create from './create/index.js';
import { getMany, getSingle } from './get/index.js';
import remove from './remove/index.js';
import update from './update/index.js';

/**
 * Initialize product routes
 * Prefix: /products.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getMany());
  router.get('/product/:id', getSingle());
  router.post('/create', create());
  router.delete('/product/:id/delete', remove());
  router.put('/product/:id/update', update());

  return router;
};

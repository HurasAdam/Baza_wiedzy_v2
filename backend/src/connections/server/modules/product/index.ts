import { Router } from 'express';
import create from './create/index.js';
import getMany from './get/many/index.js';
import get from './get/one/index.js';
import remove from './remove/index.js';
import update from './update/index.js';

/**
 * Initialize product routes
 * Prefix: /products.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getMany());
  router.get('/product/:id', get());
  router.post('/create', create());
  router.delete('/product/:id/delete', remove());
  router.put('/product/:id/update', update());

  return router;
};

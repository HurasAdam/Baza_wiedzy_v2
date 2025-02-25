import { Router } from 'express';
import create from './create/index.js';
import getMany from './get/many/index.js';
import get from './get/one/index.js';
import remove from './remove/index.js';
import update from './update/index.js';
import preventDeleteDefaultTag from '../../middleware/preventDeleteDefaultTag.js';

/**
 * Initialize tags routes
 * Prefix: /tags.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getMany());
  router.get('/tag/:id', get());
  router.post('/create', create());
  router.put('/tag/:id/update', update());
  router.delete('/tag/:id/delete', preventDeleteDefaultTag, remove());

  return router;
};

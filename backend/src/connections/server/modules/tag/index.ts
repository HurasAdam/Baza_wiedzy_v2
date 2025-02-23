import { Router } from 'express';
import create from './create/index.js';
import { getSingle, getMany } from './get/index.js';
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
  router.get('/tag/:id', getSingle());
  router.post('/create', create());
  router.put('/tag/:id/update', update());
  router.delete('/tag/:id/delete', preventDeleteDefaultTag, remove());

  return router;
};

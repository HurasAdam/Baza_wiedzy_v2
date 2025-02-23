import { Router } from 'express';
import createConversationTopic from './create/index.js';
import deleteConversationTopic from './delete/index.js';
import getConversationTopics from './get/index.js';
import getOne from './getOne/index.js';
import updateConversationTopic from './update/index.js';

/**
 * Initialize conversations routes
 * Prefix: /conversation-topics.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getConversationTopics());
  router.get('/:id', getOne());
  router.post('/create', createConversationTopic());
  router.put('/topic/:id/update', updateConversationTopic());
  router.delete('/topic/:id/delete', deleteConversationTopic());

  return router;
};

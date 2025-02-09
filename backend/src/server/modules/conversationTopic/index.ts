import { Router } from 'express';
import createConversationTopic from './create/index.js';
import deleteConversationTopic from './delete/index.js';
import { getConversationTopics, getSingleConversationTopic } from './get/index.js';
import updateConversationTopic from './update/index.js';

/**
 * Initialize conversations routes
 * Prefix: /conversation-topics.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getConversationTopics());
  router.get('/:id', getSingleConversationTopic());
  router.post('/create', createConversationTopic());
  router.put('/topic/:id/update', updateConversationTopic());
  router.delete('/topic/:id/delete', deleteConversationTopic());

  return router;
};

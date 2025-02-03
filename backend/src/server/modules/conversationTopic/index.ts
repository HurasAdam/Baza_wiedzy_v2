import { Router } from 'express';
import {
  createConversationTopicHandler,
  deleteConversationTopicHandler,
  getConversationTopicsHandler,
  getSingleConversationTopicHandler,
  updateConversationTopicleHandler,
} from '../../controllers/conversationTopic.controller.js';

const conversationTopicRoutes = Router();

// prefix /conversation-topics

conversationTopicRoutes.get('/', getConversationTopicsHandler);
conversationTopicRoutes.get('/:id', getSingleConversationTopicHandler);
conversationTopicRoutes.post('/create', createConversationTopicHandler);
conversationTopicRoutes.put('/topic/:id/update', updateConversationTopicleHandler);
conversationTopicRoutes.delete('/topic/:id/delete', deleteConversationTopicHandler);

export default conversationTopicRoutes;

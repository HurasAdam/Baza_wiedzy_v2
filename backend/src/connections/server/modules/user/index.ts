import { Router } from 'express';
import get from './get/index.js';
import getMany from './getMany/index.js';
import getWithArticleCount from './getWithArticleCount/index.js';
import getWithChangeCount from './getWithChangeCount/index.js';
import getWithReportCount from './getWithReportCount/index.js';
import getConversationReports from '../conversationReport/getUser/index.js';

/**
 * Initialize user routes
 * Prefix: /user.
 */
export default (): Router => {
  const router = Router();

  router.get('/', get());
  router.get('/users', getMany());
  router.get('/statistics', getWithReportCount());
  router.get('/statistics/:id', getConversationReports());
  router.get('/article-statistics', getWithArticleCount());
  router.get('/change-statistics', getWithChangeCount());

  return router;
};

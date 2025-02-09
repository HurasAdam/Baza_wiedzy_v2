import { Router } from 'express';
import {
  getSingle,
  getMany,
  getUsersWithArticleCount,
  getUsersWithChangeCount,
  getUsersWithReportCount,
} from './get/index.js';
import { getUserConversationReports } from '../conversationReport/get/index.js';

/**
 * Initialize user routes
 * Prefix: /user.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getSingle());
  router.get('/users', getMany());
  router.get('/statistics', getUsersWithReportCount());
  router.get('/statistics/:id', getUserConversationReports());
  router.get('/article-statistics', getUsersWithArticleCount());
  router.get('/change-statistics', getUsersWithChangeCount());

  return router;
};

import { Router } from 'express';
import addConversationReport from './add/index.js';
import { getAllConversationReports, getAllReports } from './get/index.js';

/**
 * Initialize conversations report routes
 * Prefix: /conversation-report.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getAllConversationReports());
  router.get('/all', getAllReports());
  router.post('/add', addConversationReport());

  return router;
};

import { Router } from 'express';
import addConversationReport from './add/index.js';
import getAll from './get/all/index.js';
import getAllReports from './get/allReports/index.js';
import getUserReports from './get/user/index.js';

/**
 * Initialize conversations report routes
 * Prefix: /conversation-report.
 */
export default (): Router => {
  const router = Router();

  router.get('/', getAllReports());
  router.get('/all', getAll());
  router.get('/user', getUserReports());
  router.post('/add', addConversationReport());

  return router;
};

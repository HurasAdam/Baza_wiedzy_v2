import { Router } from 'express';
import { getUserConversationReports } from '../../controllers/conversationReport.controller.js';
import {
  getUserHandler,
  getUsersHandler,
  getUsersWithArticleCountHandler,
  getUsersWithChangeCountHandler,
  getUsersWithReportCountHandler,
} from '../../controllers/user.controller.js';

const userRoutes = Router();

// prefix: /user

userRoutes.get('/', getUserHandler);

userRoutes.get('/users', getUsersHandler);
userRoutes.get('/statistics', getUsersWithReportCountHandler);
userRoutes.get('/statistics/:id', getUserConversationReports);
userRoutes.get('/article-statistics', getUsersWithArticleCountHandler);
userRoutes.get('/change-statistics', getUsersWithChangeCountHandler);
export default userRoutes;

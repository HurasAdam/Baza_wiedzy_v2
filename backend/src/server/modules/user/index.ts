import { Router } from 'express';
import {
  getUserHandler,
  getUsersHandler,
  getUsersWithArticleCountHandler,
  getUsersWithChangeCountHandler,
  getUsersWithReportCountHandler,
} from './controller.js';
import { getUserConversationReports } from '../conversationReport/get/index.js';

const userRoutes = Router();

// prefix: /user

userRoutes.get('/', getUserHandler);

userRoutes.get('/users', getUsersHandler);
userRoutes.get('/statistics', getUsersWithReportCountHandler);
userRoutes.get('/statistics/:id', getUserConversationReports());
userRoutes.get('/article-statistics', getUsersWithArticleCountHandler);
userRoutes.get('/change-statistics', getUsersWithChangeCountHandler);
export default userRoutes;

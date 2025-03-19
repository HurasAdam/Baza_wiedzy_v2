import { Router } from 'express';
import {
  createArticleController,
  deleteArticleController,
  getArticleController,
  getArticleHistoryController,
  getArticlesCreatedByUserController,
  getArticlesController,
  getArticlesHistoryByUserController,
  getHistoryItemController,
  getLatestArticlesController,
  getPopularArticlesController,
  getTrashedArticlesController,
  markAsFavouriteController,
  restoreArticleController,
  trashArticleController,
  updateArticleController,
  verifyArticleController,
} from '../controllers/article.controller';

const articleRoutes = Router();

// prefix /articles

// articleRoutes.get("/",getSessionsHandler)
articleRoutes.post('/create', createArticleController);
articleRoutes.get('/', getArticlesController);
articleRoutes.get('/popular', getPopularArticlesController);
articleRoutes.get('/latest', getLatestArticlesController);
articleRoutes.get('/trashed', getTrashedArticlesController);
articleRoutes.get('/:id', getArticleController);
articleRoutes.post('/article/:id/verify', verifyArticleController);
articleRoutes.post('/article/:id/markAsFavourite', markAsFavouriteController);
articleRoutes.put('/article/:id/update', updateArticleController);
articleRoutes.delete('/article/:id/delete', deleteArticleController);
articleRoutes.put('/article/:id/trash', trashArticleController);
articleRoutes.put('/article/:id/restore', restoreArticleController);
articleRoutes.get('/article/:id/history', getArticleHistoryController);
articleRoutes.get('/article/history/:id', getHistoryItemController);

articleRoutes.get('/userArticles/:id', getArticlesCreatedByUserController);
articleRoutes.get('/userHistory/:id', getArticlesHistoryByUserController);

export default articleRoutes;

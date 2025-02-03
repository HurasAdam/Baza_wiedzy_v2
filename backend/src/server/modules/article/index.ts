import { Router } from 'express';
import {
  createArticleHandler,
  deleteArticleHandler,
  getArticleHandler,
  getArticleHistoryHandler,
  getArticlesCreatedBySelectedUser,
  getArticlesHandler,
  getArticlesHistoryByUser,
  getFavouriteArticlesHandler,
  getLatestArticlesForDashboard,
  getPopularArticlesHandler,
  getTrashedArticlesHandler,
  markAsFavouriteHandler,
  restoreArticleHandler,
  trashArticleHandler,
  updateArticleHandler,
  verifyArticleHandler,
} from './controller.js';

const articleRoutes = Router();

// prefix /articles

// articleRoutes.get("/",getSessionsHandler)
articleRoutes.post('/create', createArticleHandler);
articleRoutes.get('/', getArticlesHandler);
articleRoutes.get('/popular', getPopularArticlesHandler);
articleRoutes.get('/latest', getLatestArticlesForDashboard);
articleRoutes.get('/trashed', getTrashedArticlesHandler);
articleRoutes.get('/:id', getArticleHandler);
articleRoutes.post('/article/:id/verify', verifyArticleHandler);
articleRoutes.post('/article/:id/markAsFavourite', markAsFavouriteHandler);
articleRoutes.put('/article/:id/update', updateArticleHandler);
articleRoutes.get('/articles/favourites', getFavouriteArticlesHandler);
articleRoutes.delete('/article/:id/delete', deleteArticleHandler);
articleRoutes.put('/article/:id/trash', trashArticleHandler);
articleRoutes.put('/article/:id/restore', restoreArticleHandler);
articleRoutes.get('/article/:id/history', getArticleHistoryHandler);
articleRoutes.get('/userArticles/:id', getArticlesCreatedBySelectedUser);
articleRoutes.get('/userHistory/:id', getArticlesHistoryByUser);

export default articleRoutes;

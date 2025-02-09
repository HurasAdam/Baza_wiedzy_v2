import { Router } from 'express';
import createArticle from './create/index.js';
import getArticle from './get/index.js';
import getArticlesCreatedBySelectedUser from './getByUser/index.js';
import getFavouriteArticles from './getFavorite/index.js';
import getLatestArticlesForDashboard from './getLatest/index.js';
import getArticles from './getMany/index.js';
import getPopularArticles from './getPopular/index.js';
import getTrashedArticles from './getTrashed/index.js';
import getArticleHistory from './history/get/index.js';
import getArticlesHistoryByUser from './history/getByUser/index.js';
import markAsFavourite from './markFavorite/index.js';
import deleteArticle from './remove/index.js';
import restoreArticle from './restore/index.js';
import trashArticle from './trash/index.js';
import updateArticle from './update/index.js';
import verifyArticle from './verify/index.js';

/**
 * Initialize article routes
 * Prefix: /articles.
 */
export default (): Router => {
  const router = Router();

  // prefix /articles

  // router.get("/",getSessionsHandler)
  router.post('/create', createArticle());
  router.get('/', getArticles());
  router.get('/:id', getArticle());
  router.get('/popular', getPopularArticles());
  router.get('/latest', getLatestArticlesForDashboard());
  router.get('/trashed', getTrashedArticles());
  router.post('/article/:id/verify', verifyArticle());
  router.post('/article/:id/markAsFavourite', markAsFavourite());
  router.put('/article/:id/update', updateArticle());
  router.get('/articles/favourites', getFavouriteArticles());
  router.delete('/article/:id/delete', deleteArticle());
  router.put('/article/:id/trash', trashArticle());
  router.put('/article/:id/restore', restoreArticle());
  router.get('/article/:id/history', getArticleHistory());
  router.get('/userArticles/:id', getArticlesCreatedBySelectedUser());
  router.get('/userHistory/:id', getArticlesHistoryByUser());

  return router;
};

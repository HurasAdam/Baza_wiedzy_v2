import { Router } from 'express';
import createArticle from './create/index.js';
import * as getMethods from './get/index.js';
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
  router.get('/', getMethods.getMany());
  router.get('/:id', getMethods.getOne());
  router.get('/popular', getMethods.getPopular());
  router.get('/latest', getMethods.getLatest());
  router.get('/trashed', getMethods.getTrashed());
  router.post('/article/:id/verify', verifyArticle());
  router.post('/article/:id/markAsFavourite', markAsFavourite());
  router.put('/article/:id/update', updateArticle());
  router.get('/articles/favourites', getMethods.getFavorite());
  router.delete('/article/:id/delete', deleteArticle());
  router.put('/article/:id/trash', trashArticle());
  router.put('/article/:id/restore', restoreArticle());
  router.get('/article/:id/history', getArticleHistory());
  router.get('/userArticles/:id', getMethods.getByUser());
  router.get('/userHistory/:id', getArticlesHistoryByUser());

  return router;
};

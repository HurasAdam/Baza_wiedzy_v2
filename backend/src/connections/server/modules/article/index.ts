import { Router } from 'express';
import Log from 'simpl-loggar';
import createArticle from './create/index.js';
import getByUser from './get/byUser/index.js';
import getFavorite from './get/fav/index.js';
import getLatest from './get/latest/index.js';
import getMany from './get/many/index.js';
import getOne from './get/one/index.js';
import getPopular from './get/popular/index.js';
import getTrashed from './getTrashed/index.js';
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
  Log.debug('Router', 'Creating endpoints');

  // router.get("/",getSessionsHandler)
  router.get('/', getMany());
  router.get('/:id', getOne());
  router.post('/create', createArticle());
  router.get('/popular', getPopular());
  router.get('/latest', getLatest());
  router.get('/trashed', getTrashed());
  router.post('/article/:id/verify', verifyArticle());
  router.post('/article/:id/markAsFavourite', markAsFavourite());
  router.put('/article/:id/update', updateArticle());
  router.get('/articles/favourites', getFavorite());
  router.delete('/article/:id/delete', deleteArticle());
  router.put('/article/:id/trash', trashArticle());
  router.put('/article/:id/restore', restoreArticle());
  router.get('/article/:id/history', getArticleHistory());
  router.get('/userArticles/:id', getByUser());
  router.get('/userHistory/:id', getArticlesHistoryByUser());

  return router;
};

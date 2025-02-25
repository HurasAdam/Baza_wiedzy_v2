import RepositoryFactory from '../../../tools/abstract/repository.js';
import ArticleHistoryModel from '../models/history.js';
import type { EControllers } from '../../../enums/controller.js';
import type { IArticleHistory } from '../types.js';

export default class ArticleHistoryRepository extends RepositoryFactory<
  IArticleHistory,
  typeof ArticleHistoryModel,
  EControllers.ArticleHistory
> {
  constructor() {
    super(ArticleHistoryModel);
  }
}

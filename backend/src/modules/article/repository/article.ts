import RepositoryFactory from '../../../tools/abstract/repository.js';
import ArticleModel from '../models/schema.js';
import type { EControllers } from '../../../enums/controller.js';
import type { IArticle } from '../types.js';

export default class ArticleRepository extends RepositoryFactory<IArticle, typeof ArticleModel, EControllers.Article> {
  constructor() {
    super(ArticleModel);
  }
}

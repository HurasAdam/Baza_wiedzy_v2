import Validation from '../../../../../tools/validation.js';
import type { IGetOneArticleDto } from './types.js';

export default class GetOneArticlesDto implements IGetOneArticleDto {
  readonly userId: string;
  readonly articleId: string;

  constructor(data: IGetOneArticleDto) {
    this.userId = data.userId;
    this.articleId = data.articleId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString();
    new Validation(this.articleId, 'articleId').isDefined().isString();
  }
}

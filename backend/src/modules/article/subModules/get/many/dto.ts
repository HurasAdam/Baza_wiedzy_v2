import Validation from '../../../../../tools/validation.js';
import type { IGetManyArticlesDto } from './types.js';
import type { IGetManyArticleReq } from '../../../../../connections/server/modules/article/get/many/types.js';

export default class GetManyArticlesDto implements IGetManyArticlesDto {
  readonly userId: string;
  readonly limit;
  readonly page;
  readonly sortBy;

  constructor(data: IGetManyArticleReq) {
    this.userId = data.userId;
    this.limit = data.query.limit;
    this.page = data.query.page;
    this.sortBy = data.query.sortBy;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString();
    if (this.limit) new Validation(this.limit, 'limit').isDefined().isString();
    if (this.sortBy) new Validation(this.sortBy, 'sortBy').isDefined().isString();
    if (this.page) new Validation(this.page, 'page').isDefined().isString();
  }
}

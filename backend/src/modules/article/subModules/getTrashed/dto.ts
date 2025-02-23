import Validation from '../../../../tools/validation.js';
import type { IGetTrashedArticlesDto } from './types.js';
import type { IGetTrashedArticlesReq } from '../../../../connections/server/modules/article/getTrashed/types.js';

export default class GetTrashedArticlesDto implements IGetTrashedArticlesDto {
  readonly userId: string;
  readonly limit?: string;
  readonly page?: string;
  readonly sortBy?: string;

  constructor(data: IGetTrashedArticlesReq) {
    this.userId = data.userId;
    this.limit = data.query.limit;
    this.page = data.query.page;
    this.sortBy = data.query.sortBy;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString();
    if (this.limit) new Validation(this.limit, 'limit').isDefined().isString();
    if (this.page) new Validation(this.page, 'page').isDefined().isString();
    if (this.sortBy) new Validation(this.sortBy, 'sortBy').isDefined().isString();
  }
}

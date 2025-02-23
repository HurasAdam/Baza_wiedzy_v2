import Validation from '../../../../../tools/validation.js';
import type { IGetArticleByUserDto } from './types.js';
import type { IGetArticleByUserReq } from '../../../../../connections/server/modules/article/get/byUser/types.js';

export default class GetArticleByUserDto implements IGetArticleByUserDto {
  readonly id: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly limit?: string;
  readonly page?: string;

  constructor(data: IGetArticleByUserReq) {
    this.id = data.params.id;
    this.startDate = data.query?.startDate as string;
    this.endDate = data.query?.endDate as string;
    this.limit = data.query?.limit;
    this.page = data.query?.page;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
    new Validation(this.startDate, 'startDate').isDefined().isString();
    new Validation(this.endDate, 'endDate').isDefined().isString();
    if (this.limit) new Validation(this.limit, 'limit').isDefined().isString();
    if (this.page) new Validation(this.page, 'page').isDefined().isNumber();
  }
}

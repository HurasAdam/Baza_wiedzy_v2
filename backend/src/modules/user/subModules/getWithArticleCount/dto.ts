import Validation from '../../../../tools/validation.js';
import type { IGetUserWithArticleCountDto } from './types.js';

export default class GetUserWithArticleCountDto implements IGetUserWithArticleCountDto {
  readonly startDate?: string;
  readonly endDate?: string;

  constructor(data: IGetUserWithArticleCountDto) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;

    this.validate();
  }

  private validate(): void {
    if (this.startDate) new Validation(this.startDate, 'startDate').isDefined().isString();
    if (this.endDate) new Validation(this.endDate, 'endDate').isDefined().isString();
  }
}

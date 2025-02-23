import Validation from '../../../../tools/validation.js';
import type { IGetUserWithChangeCountDto } from './types.js';

export default class GetUserWithChangeCountDto implements IGetUserWithChangeCountDto {
  readonly startDate?: string;
  readonly endDate?: string;

  constructor(data: IGetUserWithChangeCountDto) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;

    this.validate();
  }

  private validate(): void {
    if (this.startDate) new Validation(this.startDate, 'startDate').isDefined().isString();
    if (this.endDate) new Validation(this.endDate, 'endDate').isDefined().isString();
  }
}

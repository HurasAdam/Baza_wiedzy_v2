import Validation from '../../../../tools/validation.js';
import type { IGetUserWithReportCountDto } from './types.js';

export default class GetUsersWithReportCountDto implements IGetUserWithReportCountDto {
  readonly startDate?: string;
  readonly endDate?: string;

  constructor(data: IGetUserWithReportCountDto) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;

    this.validate();
  }

  private validate(): void {
    if (this.startDate) new Validation(this.startDate, 'startDate').isDefined().isString();
    if (this.endDate) new Validation(this.endDate, 'endDate').isDefined().isString();
  }
}

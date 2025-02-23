import Validation from '../../../../../tools/validation.js';
import type { IGetHistoryByUserDto } from './types.js';
import type { IGetHistoryByUserReq } from '../../../../../connections/server/modules/article/history/getByUser/types.js';

export default class GetHistoryByUserDto implements IGetHistoryByUserDto {
  readonly id: string;
  readonly startDate?: string;
  readonly endDate?: string;

  constructor(data: IGetHistoryByUserReq) {
    this.id = data.params.id;
    this.startDate = data.query.startDate;
    this.endDate = data.query.endDate;

    this.validate();
  }

  private validate(): void {
    new Validation(this.id, 'id').isDefined().isString();
    if (this.startDate) new Validation(this.startDate, 'startDate').isDefined().isString();
    if (this.endDate) new Validation(this.endDate, 'endDate').isDefined().isString();
  }
}

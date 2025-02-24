import Validation from '../../../../../tools/validation.js';
import type { IGetUserConversationReportsDto, IGetUserConversationReportsQuery } from './types.js';

export default class GetUserConversationReportDto implements IGetUserConversationReportsDto {
  readonly userId: string;
  readonly startDate?: string;
  readonly page?: string;
  readonly limit?: string;
  readonly endDate?: string;

  constructor(data: IGetUserConversationReportsQuery, userId: string) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.userId = userId;
    this.limit = data.limit;
    this.page = data.limit;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString();
    if (this.startDate) new Validation(this.startDate, 'startDate').isDefined().isString();
    if (this.endDate) new Validation(this.endDate, 'endDate').isDefined().isString();
    if (this.limit) new Validation(this.limit, 'limit').isDefined().isString();
    if (this.page) new Validation(this.page, 'page').isDefined().isString();
  }
}

import Validation from '../../../../../tools/validation.js';
import type { IGetConversationReportDto } from './types.js';

export default class GetConversationReportDto implements IGetConversationReportDto {
  readonly range: string;
  readonly topicId?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly limit?: string;

  constructor(data: Partial<IGetConversationReportDto>) {
    this.range = data.range as string;
    this.topicId = data.topicId;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.limit = data.limit;

    this.validate();
  }

  private validate(): void {
    new Validation(this.range, 'range').isDefined().isString();
    if (this.topicId) new Validation(this.topicId, 'topicId').isDefined().isString();
    if (this.startDate) new Validation(this.startDate, 'startDate').isDefined().isString();
    if (this.endDate) new Validation(this.endDate, 'endDate').isDefined().isString();
    if (this.limit) new Validation(this.limit, 'limit').isDefined().isString();
  }
}

import Validation from '../../../../tools/validation.js';
import type { IAddConversationReportDto } from './types.js';

export default class AddConversationReportDto implements IAddConversationReportDto {
  readonly userId: string;
  readonly description?: string;
  readonly topic: string;

  constructor(data: IAddConversationReportDto, userId: string) {
    this.userId = userId;
    this.description = data.description;
    this.topic = data.topic;

    this.validate();
  }

  private validate(): void {
    new Validation(this.topic, 'topic').isDefined().isString().hasMinLength(1);
    new Validation(this.userId, 'userId').isDefined().isString();

    if (this.description) new Validation(this.description, 'description').isDefined().isString().hasLength(190);
  }
}

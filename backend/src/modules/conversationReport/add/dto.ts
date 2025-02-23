import { newConversationReportSchema } from '../schema.js';
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
    newConversationReportSchema.parse({
      description: this.description,
      topic: this.topic,
    });
  }
}

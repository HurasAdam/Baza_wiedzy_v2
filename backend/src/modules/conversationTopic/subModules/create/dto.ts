import Validation from '../../../../tools/validation.js';
import { newConversationTopicSchema } from '../../schema.js';
import type { ICreateConversationTopicDto } from './types.js';

export default class CreateConversationTopicDto implements ICreateConversationTopicDto {
  readonly title: string;
  readonly product: string;
  readonly userId: string;

  constructor(data: ICreateConversationTopicDto, userId: string) {
    this.userId = userId;
    this.title = data.title;
    this.product = data.product;

    this.validate(data);
  }

  private validate(data: ICreateConversationTopicDto): void {
    new Validation(this.userId, 'userId').isDefined().isString();
    newConversationTopicSchema.parse(data);
  }
}

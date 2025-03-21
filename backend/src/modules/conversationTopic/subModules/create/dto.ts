import Validation from '../../../../tools/validation.js';
import type { ICreateConversationTopicDto } from './types.js';

export default class CreateConversationTopicDto implements ICreateConversationTopicDto {
  readonly title: string;
  readonly product: string;
  readonly userId: string;

  constructor(data: ICreateConversationTopicDto, userId: string) {
    this.userId = userId;
    this.title = data.title;
    this.product = data.product;

    this.validate();
  }

  private validate(): void {
    new Validation(this.userId, 'userId').isDefined().isString();
    new Validation(this.product, 'product').isDefined().isString().isObjectId();
    new Validation(this.title, 'title').isDefined().isString().hasLength(40, 1);
  }
}

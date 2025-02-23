import Validation from '../../../../tools/validation.js';
import type { IUpdateConversationTopicDto } from './types.js';

export default class UpdateConversationTopicDto implements IUpdateConversationTopicDto {
  readonly title?: string;
  readonly product?: string;
  readonly id: string;

  constructor(data: IUpdateConversationTopicDto, id: string) {
    this.title = data.title;
    this.product = data.product;
    this.id = id;

    this.validate();
  }

  private validate(): void {
    if (this.title) new Validation(this.title, 'title').isDefined().isString();
    if (this.product) new Validation(this.id, 'id').isDefined().isString();
    new Validation(this.product, 'product').isDefined().isString();
  }
}

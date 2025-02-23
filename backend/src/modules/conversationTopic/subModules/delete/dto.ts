import Validation from '../../../../tools/validation.js';
import type { IDeleteConversationTopicDto } from './types.js';

export default class DeleteConversationTopicDto implements IDeleteConversationTopicDto {
  readonly topicId: string;

  constructor(data: IDeleteConversationTopicDto) {
    this.topicId = data.topicId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.topicId, 'topicId').isDefined().isString();
  }
}

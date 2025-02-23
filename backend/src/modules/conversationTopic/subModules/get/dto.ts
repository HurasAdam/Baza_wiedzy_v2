import Validation from '../../../../tools/validation.js';
import type { IGetConversationTopicDto } from './types.js';

export default class GetConversationTopicDto implements IGetConversationTopicDto {
  readonly topicId: string;

  constructor(data: IGetConversationTopicDto) {
    this.topicId = data.topicId;

    this.validate();
  }

  private validate(): void {
    new Validation(this.topicId, 'topicId').isDefined().isString();
  }
}

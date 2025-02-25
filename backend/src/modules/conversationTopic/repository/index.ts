import RepositoryFactory from '../../../tools/abstract/repository.js';
import ConversationTopicModel from '../model.js';
import type { EControllers } from '../../../enums/controller.js';
import type { IConversation, IConversationTopicEntity } from '../types.js';
import type { RootFilterQuery, UpdateQuery } from 'mongoose';

export default class ConversationTopicRepository extends RepositoryFactory<
  IConversation,
  typeof ConversationTopicModel,
  EControllers.ConversationTopic
> {
  constructor() {
    super(ConversationTopicModel);
  }

  async updateMany(
    filter: RootFilterQuery<IConversationTopicEntity>,
    toUpdate: UpdateQuery<IConversationTopicEntity>,
  ): Promise<void> {
    await this.model.updateMany(filter, toUpdate);
  }
}

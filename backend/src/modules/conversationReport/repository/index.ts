import RepositoryFactory from '../../../tools/abstract/repository.js';
import ConversationReportModel from '../model.js';
import type { EControllers } from '../../../enums/controller.js';
import type { IConversation } from '../types.js';

export default class ConversationReportRepository extends RepositoryFactory<
  IConversation,
  typeof ConversationReportModel,
  EControllers.ConversationReport
> {
  constructor() {
    super(ConversationReportModel);
  }
}

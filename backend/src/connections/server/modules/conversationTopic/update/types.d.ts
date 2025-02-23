import type { IUpdateConversationTopicDto } from '../../../../../modules/conversationTopic/subModules/update/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

interface IUpdateConversationTopicParams {
  id: string;
}

export type IUpdateConversationTopicReq = express.Request<
  IUpdateConversationTopicParams,
  unknown,
  IUpdateConversationTopicDto,
  ParsedQs
>;

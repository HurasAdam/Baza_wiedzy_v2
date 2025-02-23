import type express from 'express';
import type { ParsedQs } from 'qs';

interface IGetOneConversationTopicParams {
  id: string;
}

export type IGetOneConversationTopicReq = express.Request<IGetOneConversationTopicParams, unknown, unknown, ParsedQs>;

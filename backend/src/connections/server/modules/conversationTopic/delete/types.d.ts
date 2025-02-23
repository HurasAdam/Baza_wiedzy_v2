import type express from 'express';
import type { ParsedQs } from 'qs';

interface IDeleteConversationTopicParams {
  id: string;
}

export type IDeleteConversationTopicReq = express.Request<IDeleteConversationTopicParams, unknown, unknown, ParsedQs>;

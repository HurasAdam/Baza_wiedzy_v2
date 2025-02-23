import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetConversationTopicReq = express.Request<unknown, unknown, unknown, ParsedQs>;

import type { IUpdateConversationTopic } from '../../../../modules/conversationTopic/subModules/update/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IUpdateConversationTopicReq = express.Request<{ id: string }, unknown, IUpdateConversationTopic, ParsedQs>;

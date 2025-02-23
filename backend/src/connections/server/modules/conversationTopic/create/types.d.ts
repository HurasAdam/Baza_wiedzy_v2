import type { ICreateConversationTopicDto } from '../../../../../modules/conversationTopic/subModules/create/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type ICreateConversationTopicReq = express.Request<unknown, unknown, ICreateConversationTopicDto, ParsedQs>;

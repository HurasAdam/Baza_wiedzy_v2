import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetAllConversationReportsReq = express.Request<unknown, unknown, unknown, ParsedQs>;

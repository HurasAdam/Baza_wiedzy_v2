import type { IAddConversationReportDto } from '../../../../../modules/conversationReport/add/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IAddConversationReportReq = express.Request<unknown, unknown, IAddConversationReportDto, ParsedQs>;

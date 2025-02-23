import type { IGetConversationReportDto } from '../../../../../modules/conversationReport/get/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetConversationReportReq = express.Request<
  unknown,
  unknown,
  unknown,
  Partial<IGetConversationReportDto> & ParsedQs
>;

import type { IGetUserConversationReportsQuery } from '../../../../../modules/conversationReport/getUser/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

interface IGetUserConversationReportParams {
  id: string;
}

export type IGetUserConversationReportReq = express.Request<
  IGetUserConversationReportParams,
  unknown,
  unknown,
  IGetUserConversationReportsQuery & ParsedQs
>;

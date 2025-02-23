import type express from 'express';
import type { ParsedQs } from 'qs';

interface IGetHistoryParams {
  id: string;
}

export type IGetHistoryReq = express.Request<IGetHistoryParams, unknown, unknown, ParsedQs>;

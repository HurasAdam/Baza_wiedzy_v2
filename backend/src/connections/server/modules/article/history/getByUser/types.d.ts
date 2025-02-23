import type express from 'express';
import type { ParsedQs } from 'qs';

interface IGetHistoryByUserParams {
  id: string;
}

interface IGetHistoryByUserQuery {
  startDate: string;
  endDate: string;
}

export type IGetHistoryByUserReq = express.Request<
  IGetHistoryByUserParams,
  unknown,
  unknown,
  Partial<IGetHistoryByUserQuery> & ParsedQs
>;

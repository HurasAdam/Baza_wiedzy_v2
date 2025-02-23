import type { IGetUserWithReportCountQuery } from '../../../../../modules/user/subModules/getWithReportCount/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetUsersWithReportCountReq = express.Request<
  unknown,
  unknown,
  unknown,
  IGetUserWithReportCountQuery & ParsedQs
>;

import type { IGetUserWithChangeCountQuery } from '../../../../../modules/user/subModules/getWithChangeCount/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetWithChangesCountReq = express.Request<
  unknown,
  unknown,
  unknown,
  IGetUserWithChangeCountQuery & ParsedQs
>;

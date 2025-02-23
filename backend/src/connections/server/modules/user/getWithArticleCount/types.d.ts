import type { IGetUserWithArticleCountQuery } from '../../../../../modules/user/subModules/getWithArticleCount/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetUsersWithArticleChangesReq = express.Request<
  unknown,
  unknown,
  unknown,
  IGetUserWithArticleCountQuery & ParsedQs
>;

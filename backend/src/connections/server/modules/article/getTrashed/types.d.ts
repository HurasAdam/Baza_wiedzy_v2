import type { IGetTrashedArticlesDto } from '../../../../../modules/article/subModules/get/trashed/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetTrashedArticlesReq = express.Request<
  unknown,
  unknown,
  unknown,
  Partial<IGetTrashedArticlesDto> & ParsedQs
>;

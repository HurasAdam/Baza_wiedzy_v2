import type { IGetUserWithChangeCountDto } from '../../../../modules/user/getUserWithChangeCount/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetUserWithChangeCountReq = express.Request<
  unknown,
  unknown,
  unknown,
  Partial<IGetUserWithChangeCountDto> & ParsedQs
>;

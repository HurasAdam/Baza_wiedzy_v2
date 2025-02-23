import type { IGetArticleByUserDto } from '../../../../../../modules/article/subModules/get/byUser/types.d.ts';
import type express from 'express';
import type { ParsedQs } from 'qs';

interface IGetArticleByUserParams {
  id: string;
}

export type IGetArticleByUserReq = express.Request<
  IGetArticleByUserParams,
  unknown,
  unknown,
  Partial<IGetArticleByUserDto> & ParsedQs
>;

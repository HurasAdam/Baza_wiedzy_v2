import type { IGetOneArticleDto } from '../../../../../../modules/article/subModules/get/one/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

interface IGetOneArticleParams {
  id: string;
}

export type IGetOneArticleReq = express.Request<
  IGetOneArticleParams,
  unknown,
  unknown,
  Partial<IGetOneArticleDto> & ParsedQs
>;

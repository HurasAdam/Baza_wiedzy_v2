import type { IGetOneArticleDto } from '../../../../../modules/article/subModules/getOne/types.d.ts';
import type express from 'express';
import type { ParsedQs } from 'qs';

interface IGetOneArticleParams {
  articleId: string;
}

export type IGetOneArticleReq = express.Request<
  IGetOneArticleParams,
  unknown,
  unknown,
  Partial<IGetOneArticleDto> & ParsedQs
>;

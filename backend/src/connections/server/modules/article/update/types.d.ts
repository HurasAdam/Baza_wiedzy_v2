import type { IUpdateArticleDto } from '../../../../../modules/article/subModules/update/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

interface IUpdateArticleParams {
  id: string;
}

export type IUpdateArticleReq = express.Request<IUpdateArticleParams, unknown, IUpdateArticleDto, ParsedQs>;

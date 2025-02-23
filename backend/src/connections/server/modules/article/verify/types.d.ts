import type { IVerifyArticleDto } from '../../../../../modules/article/subModules/verify/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

interface IVerifyArticleParams {
  id: string;
}

export type IVerifyArticleReq = express.Request<IVerifyArticleParams, unknown, IVerifyArticleDto, ParsedQs>;

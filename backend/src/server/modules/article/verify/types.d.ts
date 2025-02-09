import type { IVerifyArticle } from '../../../../modules/article/subModules/verify/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IVerifyArticleReq = express.Request<{ id: string }, unknown, IVerifyArticle, ParsedQs>;

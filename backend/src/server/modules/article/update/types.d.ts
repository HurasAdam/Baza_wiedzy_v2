import type { IUpdateArticle } from '../../../../modules/article/subModules/update/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IUpdateArticleReq = express.Request<{ id: string }, unknown, IUpdateArticle, ParsedQs>;

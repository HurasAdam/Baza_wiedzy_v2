import type { IGetOneArticleDto } from '../../../../../../modules/article/subModules/get/one/types.d.ts';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetPopularArticlesReq = express.Request<unknown, unknown, unknown, Partial<IGetOneArticleDto> & ParsedQs>;

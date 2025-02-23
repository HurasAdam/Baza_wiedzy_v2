import type { IGetManyArticlesDto } from '../../../../../../modules/article/subModules/get/many/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetManyArticleReq = express.Request<unknown, unknown, unknown, Partial<IGetManyArticlesDto> & ParsedQs>;

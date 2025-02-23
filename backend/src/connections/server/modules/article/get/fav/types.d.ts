import type { IGetFavArticlesDto } from '../../../../../../modules/article/subModules/favorite/get/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetFavArticleReq = express.Request<unknown, unknown, unknown, Partial<IGetFavArticlesDto> & ParsedQs>;

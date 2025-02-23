import type { IGetLatestArticleDto } from '../../../../../../modules/article/subModules/get/latest/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetLatestArticleReq = express.Request<unknown, unknown, unknown, Partial<IGetLatestArticleDto> & ParsedQs>;

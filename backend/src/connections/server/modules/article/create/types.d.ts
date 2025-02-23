import type { ICreateArticleDto } from '../../../../../modules/article/subModules/create/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type ICreateArticleReq = express.Request<unknown, unknown, ICreateArticleDto, ParsedQs>;

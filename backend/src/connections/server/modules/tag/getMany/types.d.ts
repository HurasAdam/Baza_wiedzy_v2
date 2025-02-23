import type { IGetManyTagsDto } from '../../../../../modules/tag/subModules/getMany/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetManyTagReq = express.Request<unknown, unknown, unknown, IGetManyTagsDto & ParsedQs>;

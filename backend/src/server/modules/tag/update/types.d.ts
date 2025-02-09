import type { IUpdateTag } from '../../../../modules/tag/subModules/update/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IUpdateTagReq = express.Request<{ id: string }, unknown, IUpdateTag, ParsedQs>;

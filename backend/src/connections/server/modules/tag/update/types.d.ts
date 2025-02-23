import type { IUpdateTagDto } from '../../../../../modules/tag/subModules/update/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

interface IUpdateTagParams {
  id: string;
}

export type IUpdateTagReq = express.Request<IUpdateTagParams, unknown, IUpdateTagDto, ParsedQs>;

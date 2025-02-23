import type { IUpdateProductDto } from '../../../../../modules/product/subModules/update/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

interface IUpdateProductParams {
  id: string;
}

export type IUpdateProductReq = express.Request<IUpdateProductParams, unknown, IUpdateProductDto, ParsedQs>;

import type { IUpdateProduct } from '../../../../modules/product/subModules/update/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IUpdateProductReq = express.Request<{ id: string }, unknown, IUpdateProduct, ParsedQs>;

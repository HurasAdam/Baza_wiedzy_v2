import type { ICreateProductDto } from '../../../../../modules/product/subModules/create/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type ICreateProductReq = express.Request<unknown, unknown, ICreateProductDto, ParsedQs>;

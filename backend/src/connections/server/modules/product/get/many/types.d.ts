import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetManyProductsReq = express.Request<unknown, unknown, unknown, ParsedQs>;

import type express from 'express';
import type { ParsedQs } from 'qs';

interface IGetProductParams {
  id: string;
}

export type IGetProductReq = express.Request<IGetProductParams, unknown, unknown, ParsedQs>;

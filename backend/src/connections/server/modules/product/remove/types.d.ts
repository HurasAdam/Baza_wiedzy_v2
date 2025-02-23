import type express from 'express';
import type { ParsedQs } from 'qs';

interface IRemoveProductParams {
  id: string;
}

export type IRemoveProductReq = express.Request<IRemoveProductParams, unknown, unknown, ParsedQs>;

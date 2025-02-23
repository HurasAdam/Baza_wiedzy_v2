import type express from 'express';
import type { ParsedQs } from 'qs';

interface IGetTagParams {
  id: string;
}

export type IGetTagReq = express.Request<IGetTagParams, unknown, unknown, ParsedQs>;

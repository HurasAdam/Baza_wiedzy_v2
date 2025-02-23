import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetSessionReq = express.Request<unknown, unknown, unknown, ParsedQs>;

import type express from 'express';
import type { ParsedQs } from 'qs';

export type ILogoutReq = express.Request<unknown, unknown, unknown, ParsedQs>;

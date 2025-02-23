import type express from 'express';
import type { ParsedQs } from 'qs';

export type IRefreshTokenReq = express.Request<unknown, unknown, unknown, ParsedQs>;

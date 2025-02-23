import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetUsersReq = express.Request<unknown, unknown, unknown, ParsedQs>;

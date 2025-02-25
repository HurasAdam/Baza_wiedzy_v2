import type express from 'express';
import type { ParsedQs } from 'qs';

export type IGetManyUsersReq = express.Request<unknown, unknown, unknown, ParsedQs>;

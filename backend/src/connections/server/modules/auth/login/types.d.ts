import type { ILoginDto } from '../../../../../modules/auth/subModules/login/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type ILoginReq = express.Request<unknown, unknown, ILoginDto, ParsedQs>;

import type { IRegisterDto } from '../../../../../modules/auth/subModules/register/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IRegisterReq = express.Request<unknown, unknown, IRegisterDto, ParsedQs>;

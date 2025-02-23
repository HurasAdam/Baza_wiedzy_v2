import type { IResetPasswordDto } from '../../../../../modules/auth/subModules/resetPassword/types.js';
import type express from 'express';
import type { ParsedQs } from 'qs';

export type IResetPasswordReq = express.Request<unknown, unknown, IResetPasswordDto, ParsedQs>;

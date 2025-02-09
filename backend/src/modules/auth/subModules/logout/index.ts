import { verifyToken } from '../../../../tools/passwords.js';
import SessionModel from '../../../session/model.js';
import type { IAccessTokenPayload } from '../../../../types/tokens.js';

export default async (accessToken: string | undefined): Promise<void> => {
  const { payload } = verifyToken(accessToken ?? '') as { payload: IAccessTokenPayload };

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }
};

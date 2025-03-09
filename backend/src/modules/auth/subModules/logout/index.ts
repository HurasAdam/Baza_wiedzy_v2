import { verifyToken } from '../../../../tools/passwords.js';
import SessionRepository from '../../../session/repository/index.js';
import type { IAccessTokenPayload } from '../../../../types/tokens.js';

/**
 * Export controller, for endpoint to logout user.
 * @param accessToken
 * @returns LogoutUser.
 */
export default async (accessToken: string): Promise<void> => {
  const { payload } = verifyToken(accessToken) as { payload: IAccessTokenPayload };

  const repo = new SessionRepository();

  if (payload) {
    await repo.remove(payload.sessionId.toString());
  }
};

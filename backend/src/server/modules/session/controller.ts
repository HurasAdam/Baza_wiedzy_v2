import { z } from 'zod';
import { EHttpCodes } from '../../../enums/http.js';
import SessionModel from '../../../modules/session/model.js';
import appAssert from '../../../utils/appAssert.js';
import catchErrors from '../../../utils/catchErrors.js';

export const getSessionsHandler = catchErrors(async (req, res) => {
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: Date.now() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    },
  );

  return res.status(EHttpCodes.OK).json(
    // mark the current session
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    })),
  );
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, EHttpCodes.NOT_FOUND, 'Session not found');

  return res.status(EHttpCodes.OK).json({ message: 'Session removed' });
});

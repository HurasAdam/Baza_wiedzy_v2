import { EAppErrorCode } from '../../../enums/errors.js';
import { EHttpCodes } from '../../../enums/http.js';
import UserModel from '../../../modules/user/model.js';
import appAssert from '../../../utils/appAssert.js';
import type { RequestHandler } from 'express';

const roleGuard = (requiredRole: string): RequestHandler => {
  return async (req, _res, next) => {
    const { userId } = req;

    appAssert(userId, EHttpCodes.UNAUTHORIZED, 'Not authorized', EAppErrorCode.InvalidAccessToken);

    // Pobierz użytkownika z bazy danych
    const user = await UserModel.findById(userId).select('role');
    appAssert(user, EHttpCodes.UNAUTHORIZED, 'User not found', EAppErrorCode.UserNotFound);

    // Sprawdź, czy użytkownik ma odpowiednią rolę
    appAssert(
      user.role === requiredRole,
      EHttpCodes.FORBIDDEN,
      'You do not have permission to access this resource',
      EAppErrorCode.Forbidden,
    );

    next();
  };
};

export default roleGuard;

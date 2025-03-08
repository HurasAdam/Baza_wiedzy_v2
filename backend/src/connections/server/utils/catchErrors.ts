import type { Request, Response, NextFunction } from 'express';
import type { ParsedQs } from 'qs';

/**
 * @param controller
 */
export default function <T extends Request<unknown, unknown, unknown, ParsedQs>>(
  controller: (req: T, res: Response, next: NextFunction) => Promise<void>,
) {
  return async (req: T, res: Response, next: NextFunction): Promise<void> => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

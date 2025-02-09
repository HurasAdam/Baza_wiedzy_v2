import type { NextFunction, Request, Response } from 'express';

export type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * @param controller
 */
export default function (controller: AsyncController) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

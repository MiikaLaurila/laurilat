import { NextFunction, Request, Response } from 'express';

export const asyncWrapper = (
  asyncRouteHandler: (req: Request, res: Response, next: NextFunction) => Promise<Response>
) => {
  return (req: Request, res: Response, next: NextFunction) => asyncRouteHandler(req, res, next).catch(next);
};

import { Request, Response, NextFunction } from 'express';

export const needsAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.admin) {
    return res.status(403).send({
      success: false,
      message: 'Forbidden',
    });
  }
  return next();
};

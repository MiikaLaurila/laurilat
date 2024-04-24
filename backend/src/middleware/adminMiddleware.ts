import { Request, Response, NextFunction } from 'express';

export const onlyAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.admin) {
    return res.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
  }
  return next();
};

import { Request, Response, NextFunction } from 'express';
import { Session, SessionData } from 'express-session';

export interface LoggedInRequest extends Request {
  session: Session & SessionData;
}

export const needsLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.username) {
    return res.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
  }
  return next();
};

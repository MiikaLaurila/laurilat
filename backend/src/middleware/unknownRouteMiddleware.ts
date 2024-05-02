import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const unknownRoute = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).send({ message: 'Not Found' });
};

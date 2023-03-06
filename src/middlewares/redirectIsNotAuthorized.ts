import { Request, Response, NextFunction } from 'express';

export function redirectIsNotAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.redirect('/');
  }

  return next();
}

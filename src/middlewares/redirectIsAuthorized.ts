import { Request, Response, NextFunction } from 'express';

export function redirectIsAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user) {
    return res.redirect('/dialogues');
  } 

  return next();
}

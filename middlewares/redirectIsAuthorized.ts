import { Request, Response, NextFunction } from 'express';

export function redirectIsAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //console.log(req.user);
  
  if (req.user) {
    console.log('hi mf');
    return res.redirect('/dashboard');
  }

  return next();
}

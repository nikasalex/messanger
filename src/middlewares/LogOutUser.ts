import { Request, Response, NextFunction } from 'express';
import { client } from '../server';

export async function logOut(
  req: Request,
  res: Response,
  next: NextFunction
) {
    const sessionId: string | undefined = req.cookies['x-session-id']    
    await client.del(sessionId);
  return next();
}

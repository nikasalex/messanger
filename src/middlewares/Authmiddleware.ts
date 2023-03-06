import { AppDataSource } from '../data_source';
import { Request, Response, NextFunction } from 'express';
import { Users } from '../entity/users';
import { Sessions } from '../entity/session';

export async function Authmiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionId = req.cookies['x-session-id'];
  if (sessionId) {
    const session = await AppDataSource.getRepository(Sessions).findOneBy({
      session_id: sessionId,
    });
    if (session) {
      const user = await AppDataSource.getRepository(Users).findOneBy({
        user_id: session.user_id,
      });

      if (user) {
        req.user = user;
      }
    }
  }
  return next();
}

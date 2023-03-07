import { Request, Response, NextFunction } from 'express';
import { userRepository } from '../repository';
import { client } from '../server';


export async function Authmiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionId: string | undefined = req.cookies['x-session-id'];
  if (sessionId) {
    const user_id = JSON.parse(await client.get(sessionId));
    if (user_id) {
      const user = await userRepository.findById(user_id);
      if (user) {
        req.user = user;
      }
    }
  }
  return next();
}

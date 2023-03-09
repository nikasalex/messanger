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
        res.clearCookie('x-session-id')
        res.cookie('x-session-id', sessionId, {
          secure: false, // change when we have front
          httpOnly: true,
          expires: new Date(Date.now() + 10 * 60 * 1000),
        });
        await client.del(sessionId)
        await client.set(sessionId, user.id, { EX: 10 * 60 });
      }
    }
  }
  return next();
}

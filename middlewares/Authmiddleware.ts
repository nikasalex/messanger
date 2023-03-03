import { AppDataSource } from '../data_source';
import { Request, Response, NextFunction } from 'express';
import { Users } from '../src/entity/users';
import { Sessions } from '../src/entity/session';

export async function Authmiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('Hello');

  
  const sessionId: any = req.cookies
  console.log(sessionId);
 

  // if (sessionId) {
  //   const session = await AppDataSource.getRepository(Sessions).findOneBy({
  //     session_id: sessionId,
  //   });
  //   if (session) {
  //     const user = await AppDataSource.getRepository(Users).findOneBy({
  //       user_id: session.user_id,
  //     });

  //     if (user) {
  //       console.log("fuck");
        
  //       req.user = user;
  //     }
  //   }
  // }
  return next();
}


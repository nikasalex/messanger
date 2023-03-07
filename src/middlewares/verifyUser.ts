import { Request, Response, NextFunction } from 'express';
import { userRepository, tokensRepository } from '../repository';

export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.query.token;
  let tokenS: string | undefined;
  if (token) {
    tokenS = token.toString();
  }
  const tokenFound = await tokensRepository.findByToken(tokenS);
  if (tokenFound) {
    const user = await userRepository.findById(tokenFound.user_id);
   
    if (tokenFound.expire > new Date()) {
      user.verify = true;
      await userRepository.save(user);
    } else {
      tokensRepository.checkExpire()
  }

  next();
}
}
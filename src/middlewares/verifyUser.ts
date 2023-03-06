import { AppDataSource } from '../data_source';
import { Request, Response, NextFunction } from 'express';
import { vTokens } from '../entity/verifyTokens';
import { Users } from '../entity/users';

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
  const tokenFound = await AppDataSource.getRepository(vTokens).findOneBy({
    token: tokenS,
  });
  if (tokenFound) {
    const userRepository = AppDataSource.getRepository(Users);
    const user = await AppDataSource.getRepository(Users).findOneBy({
      user_id: tokenFound.user_id,
    });
    if (tokenFound.expire > new Date()) {
      user.verify = true;
      await userRepository.save(user);
    } else {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(vTokens)
        .where('expire <= :currentDate', { currentDate: new Date() })
        .execute();
    }
  }

  next();
}

import { Users } from '../entity/users';
import { AppDataSource } from '../data_source';
import { Sessions } from '../entity/session';
import { pTokens } from '../entity/passTokens';
import { vTokens } from '../entity/verifyTokens';

export class UseRepository {
  getRepository(table: any) {
    return AppDataSource.getRepository(table);
  }

  async findUser(email: string) {
    const user = await AppDataSource.getRepository(Users).findOneBy({
      email: email,
    });
    return user;
  }

  async findSession(user_id: number) {
    const session = await AppDataSource.getRepository(Sessions).findOneBy({
      user_id: user_id,
    });
    return session;
  }

  async findPassToken(pToken: string) {
    const token = await AppDataSource.getRepository(pTokens).findOneBy({
      token: pToken,
    });
    return token;
  }
  async findVerifyToken(vToken: string) {
    const token = await AppDataSource.getRepository(vTokens).findOneBy({
      token: vToken,
    });
    return token;
  }
}

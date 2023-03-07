import { Tokens } from "../entity/Tokens";
import { AppDataSource } from "../data_source";

export const tokensRepository = AppDataSource.getRepository(Tokens).extend({
    findByUserId(user_id: number){
        return this.findOneBy({user_id})
    },
    findByToken(token: string){
        return this.findOneBy({token})
    },
    checkExpire(){
         AppDataSource.createQueryBuilder()
        .delete()
        .from(Tokens)
        .where('expire <= :currentDate', { currentDate: new Date() })
        .execute();
    }
    }
)
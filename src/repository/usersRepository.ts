import { Users } from '../entity/users';
import { AppDataSource } from '../data_source';





export const userRepository = AppDataSource.getRepository(Users).extend({
  findByEmail(email: string){
   return this.findOneBy({email})
  },
  findById(id: number){
    return this.findOneBy({id})
  }
})

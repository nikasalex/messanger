import { AppDataSource } from '../data_source';
import { Dialogues } from '../entity/dialogues';

export const dialoguesRepository = AppDataSource.getRepository(
  Dialogues
).extend({
  findByUser(id: number) {
    return this.find({
      relations: {
        users: true,
      },
      where: {
        users: {
          id,
        },
      },
    });
  },
  findByName(name: string) {
    return this.findOneBy({ name });
  },
  findById(id:number){
    return this.findOneBy({
      id
    })
  }
});

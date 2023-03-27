import { Dialogues } from '../entity/dialogues';
import { AppDataSource } from '../data_source';
import { Messages } from '../entity/messages';


export const messagesRepository = AppDataSource.getRepository(Messages).extend({
   getMessagesByDialogueID(id: number) {
    return this.find({
      select:{
        user: {
          id: true,
          firstName: true,
          lastName: true,
        }
        
      },
      relations: {
        dialogue: true,
        user: true
      },
      where: {
        dialogue: {
          id
        }

      },
      order: {
        createAt: "DESC"
      },
      skip: 0,
      take: 50
    });
  },
  
  removeMessagesByDialogueID(dialogueId: number){
    return (
      this
      .createQueryBuilder()
      .delete()
      .where("dialogueId = :dialogueId", {dialogueId})
      .execute()
    )
  }

});




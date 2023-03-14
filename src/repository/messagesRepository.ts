import { Dialogues } from '../entity/dialogues';
import { AppDataSource } from '../data_source';
import { Messages } from '../entity/messages';


export const messagesRepository = AppDataSource.getRepository(Messages).extend({
  getMessagesByDialogueID(id: number) {
    return this.find({
      relations: {
        dialogue: true,
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
  
});

// export  function newMessage(message:string,dialogue:Dialogues)
// {
//   const msg = new Messages();
//   msg.message = message;
//   msg.date = new Date(Date.now());
//   msg.dialogue = dialogue;
//   return msg
// }
import { Request, Response, NextFunction } from 'express';
import {
  userRepository,
  dialoguesRepository,
  messagesRepository,
} from '../../repository';

export class MessagerController {
  async createDialogue(req: Request, res: Response, next: NextFunction) {
    try {
      const { nameDialogue, emailTo } = req.body;
      const emailFrom = req.user.email;
      const userTo = await userRepository.findByEmail(emailTo);
      const userFrom = await userRepository.findByEmail(emailFrom);
      await dialoguesRepository.save({
        name: nameDialogue,
        users: [userTo, userFrom],
      });
      return res.json({ message: 'Dialogue was created' });
    } catch (e) {
      return res.status(400).json({ messages: 'Error, create dialogue', e });
    }
  }

  async getDialogues(req: Request, res: Response, next: NextFunction) {
    try {
      //const id: number | undefined = req.user.id;
      const id = 2;
      const dialogues = await dialoguesRepository.findByUser(id);
      return res.json(dialogues);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Error, get dialogues' });
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.dialogueId; 
       
      if(id){
        const messages = await messagesRepository.getMessagesByDialogueID(+id);
        return res.json(messages);
      }
      
      return next();
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Error with get messages' });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      // TODO: check permission
       const dialogueId = req.params.dialogueId;
      const { message } = req.body;
      const dialogue = await dialoguesRepository.findById(+dialogueId)
   
      
      
      await messagesRepository.save({
        message,
        dialogue,
      });
      return res.status(200).json('Msg saved')
    } catch (e) {
      console.log(e);

      return res.status(400).json({ messages: 'Error, create message', e });
    }
  }
}

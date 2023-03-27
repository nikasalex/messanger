import { Request, Response, NextFunction } from 'express';
import { SchemaNewDialogue } from '../../components';
import {
  userRepository,
  dialoguesRepository,
  messagesRepository,
} from '../../repository';
import { ZodError } from 'zod';
import { io } from '../../server'

export class MessagerController {
  async createDialogue(req: Request, res: Response, next: NextFunction) {
    try {
      const fetchedDialogue = SchemaNewDialogue.parse(req.body);
      const { nameDialogue, emailTo } = fetchedDialogue;
      const emailFrom = req.user.email;
      const userTo = await userRepository.findByEmail(emailTo);
      if (!userTo) {
        return res
          .status(404)
          .json({ message: `User with ${emailTo} not found!` });
      }
      const userFrom = await userRepository.findByEmail(emailFrom);
      const dialogue = await dialoguesRepository.save({
        name: nameDialogue,
        users: [userTo, userFrom],
      });
      const fetchedSockets = await io.fetchSockets();
      fetchedSockets.forEach((socket)=>{
        socket.emit('createDialogue', dialogue)

      })
      return res.json({ message: 'Dialogue was created' });
    } catch (err) {
      if (err instanceof ZodError) {
        console.log(err.message);
        return res.status(404).json({ message: err });
      }
      return res.status(403).json({ messages: 'Error, create dialogue', err });
    }
  }

  async getDialogues(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number | undefined = req.user.id;
      if (!id) {
        return res.redirect('http://localhost:3000/');
      }
      const dialogues = await dialoguesRepository.findByUser(id);
      return res.json(dialogues);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Error, get dialogues', e });
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const dialogueId = req.params.dialogueId;
      const userId = req.user.id
      
      const dialogues = await dialoguesRepository.findByUser(userId)
      let premission: boolean = false;
      dialogues.forEach((dialogue: any)=> {
        if (dialogue.id === +dialogueId){        
          premission = true
        }
      })
      
      if(!premission){
      return res.status(403).json({message: 'Don`t have permission'});  
      }

      if (dialogueId) {
        const messages = await messagesRepository.getMessagesByDialogueID(+dialogueId);
        const revMessages = messages.reverse()
        
        return res.json(revMessages);
      }

      return next();
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Error with get messages' });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const dialogueId = req.params.dialogueId;
      const userId = req.user.id;
      const { message } = req.body;
      const dialogue = await dialoguesRepository.findById(+dialogueId);
      const user = await userRepository.findById(+userId);

      const msg = await messagesRepository.save({
        message,
        dialogue,
        user,
      });
      const fetchedSockets = await io.fetchSockets();
      fetchedSockets.forEach((socket)=>{
        socket.emit('msg', msg)
      })

      return res.status(200).json('Msg saved');
    } catch (e) {
      console.log(e);

      return res.status(400).json({ messages: 'Error, create message', e });
    }
  }

  async deleteMessages(req:Request, res:Response){
    try{
      const dialogueId = req.params.dialogueId;
      await messagesRepository.removeMessagesByDialogueID(+dialogueId)
      const fetchedSockets = await io.fetchSockets();
      fetchedSockets.forEach((socket)=>{
        socket.emit('deletemsg')
      })
      return res.json({messages: 'Messeges deleted'})
    }
    catch(e){
      console.log(e);
      return res.status(400).json({ messages: 'Error, delete messages', e });
    }
  }

  async deleteDialogue(req:Request, res:Response){
    try{
      const dialogueId = req.params.dialogueId;
      await messagesRepository.removeMessagesByDialogueID(+dialogueId)
      await dialoguesRepository.removeByID(+dialogueId)
      const fetchedSockets = await io.fetchSockets();
      fetchedSockets.forEach((socket)=>{
        socket.emit('deletedialogue')
      })
      return res.json({messages: 'Dialogue deleted'})


    }
    catch(e){
      console.log(e);
      return res.status(400).json({ messages: 'Error, delete dialogue', e });
    }
  }


}

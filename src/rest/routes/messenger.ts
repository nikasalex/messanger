import { Router } from 'express';
import { MessagerController } from '../controllers/MessagerController';
const controller = new MessagerController();
const routerMs = Router();

routerMs.get(
  '/dialogues', controller.getDialogues
);

routerMs.get('/dialogue/:dialogueId', controller.getMessages) 

routerMs.post('/dialogues', controller.createDialogue);

routerMs.post('/dialogue/:dialogueId', controller.sendMessage) 
routerMs.get('/dialogue/removedialogue/:dialogueId', controller.deleteDialogue) 

routerMs.get('/dialogue/removemsg/:dialogueId', controller.deleteMessages)


export = routerMs;

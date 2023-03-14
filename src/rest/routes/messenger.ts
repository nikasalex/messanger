import { Router } from 'express';
import { Request, Response } from 'express';
import { redirectIsNotAuthorized } from '../../middlewares/redirectIsNotAuthorized';
import { MessagerController } from '../controllers/MessagerController';
const controller = new MessagerController();
const routerMs = Router();

routerMs.get(
  '/dialogues',
  redirectIsNotAuthorized, controller.getDialogues
);

routerMs.get('/dialogue/:dialogueId', controller.getMessages) // /:dialodueId', );

routerMs.post('/dialogues', controller.createDialogue);

routerMs.post('/dialogue/:dialogueId', controller.sendMessage) // /:dialodueId');

export = routerMs;

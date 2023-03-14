import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Request, Response } from 'express';
import { redirectIsAuthorized } from '../../middlewares/redirectIsAuthorized';
import { verifyUser } from '../../middlewares/verifyUser';

const controller = new AuthController();
const routerAuth = Router();

routerAuth.get(
  '/',
  verifyUser,
  redirectIsAuthorized,
  (_req: Request, res: Response) => {
    res.send('Hello');
  }
);


routerAuth.post('/', controller.login);

routerAuth.post('/passwordreset', controller.passwordReset);
routerAuth.post('/forgotpass', controller.forgotpass);

routerAuth.post('/signup', controller.signup);
routerAuth.post('/verify', controller.verify);

export = routerAuth;

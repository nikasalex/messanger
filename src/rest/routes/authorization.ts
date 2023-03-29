import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Request, Response } from 'express';
import { verifyUser } from '../../middlewares/VerifyUser';
import { logOut } from '../../middlewares/LogOutUser';

const DOMAIN = process.env.B_DOMAIN

const controller = new AuthController();
const routerAuth = Router();

routerAuth.get(
  '/',
  verifyUser,(_req:Request, res:Response)=>{
    res.redirect(`http://${DOMAIN}:3000/`)
  }
);

routerAuth.get('/user', (req:Request, res:Response)=>{
  res.json(req.user)
})

routerAuth.get('/logout', logOut,(req:Request, res:Response)=>{
  res.json({message: "Good"})
} )


routerAuth.post('/login', controller.login);

routerAuth.post('/passwordreset', controller.passwordReset);
routerAuth.post('/forgotpass', controller.forgotpass);

routerAuth.post('/signup', controller.signup);
routerAuth.post('/verify', controller.verify);





export = routerAuth;

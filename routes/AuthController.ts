import { AppDataSource } from '../data_source';
import { Request, Response } from 'express';
import { Users } from '../src/entity/users';
import { validationResult } from 'express-validator';
import { HashAndVerify } from '../config/hashAndVerify';
import { Sessions } from '../src/entity/session';
import { Mail } from '../services/mailgunVerify';
import { MailRestore } from '../services/mailgunPass';
import { mg } from '../data_source';
import { vTokens } from '../src/entity/verifyTokens';
import { pTokens } from '../src/entity/passTokens';
const DOMAIN = 'sandbox2db6b58a1f93439ba874e8f010a1c76c.mailgun.org';

const mail = new Mail();
const mailPass = new MailRestore();
const hashAndVeridy = new HashAndVerify();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const errors: any = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `${errors.errors[0].msg}` });
      }
      const { email, password } = req.body;
      const user = await AppDataSource.getRepository(Users).findOneBy({
        email: email,
      });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const verify = await hashAndVeridy.Verify(password, user.password);
      if (!verify) {
        return res.status(400).json({ message: 'Password incorrect' });
      }

      if (!user.verify) {
        return res.status(301).json({ message: 'You are not verified' }); // redirect on verify page
      }

      const checkSession = await AppDataSource.getRepository(
        Sessions
      ).findOneBy({
        user_id: user.user_id,
      });

      if (!checkSession) {
        const sessionRepository = AppDataSource.getRepository(Sessions);
        const session = new Sessions();
        session.user_id = user.user_id;
        await sessionRepository.save(session);
      }
      const session = await AppDataSource.getRepository(Sessions).findOneBy({
        user_id: user.user_id,
      });

      res.cookie('x-session-id', session.session_id, {
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 60 * 1000),
      });

      return res.json({
        message: 'Hello User!',
        userData: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (err) {
      console.log('Error', err);
      res.status(400).json({ message: 'Login Error' });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const errors: any = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `${errors.errors[0].msg}` });
      }
      const { email, firstName, lastName, password } = req.body;
      const userRepository = AppDataSource.getRepository(Users);
      const candidate = await AppDataSource.getRepository(Users).findOneBy({
        email: email,
      });
      if (candidate) {
        return res
          .status(404)
          .json({ message: `This user with ${email} is exist` });
      }
      const hashPassword = await hashAndVeridy.Hash(password, null);
      const user = new Users();
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.verify = false;
      user.password = hashPassword;
      await userRepository.save(user); //for test
      const dateExpire = Date.now() + 60 * 1000;
      const tokensRepository = AppDataSource.getRepository(vTokens);
      const token = new vTokens();
      token.expire = new Date(dateExpire);
      token.user_id = user.user_id;
      await tokensRepository.save(token); //fro test

      const userData = mail.createData(email, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: token.token,
      });
      const data = mail.getData(userData);
      mg.messages.create(DOMAIN, data);

      return res.json({ message: 'User registered successfully' });
    } catch (err) {
      console.log('Error', err);
      return res.status(400).json({ message: 'Error' });
    }
  }

  async forgotpass1(req: Request, res: Response) {
    try {
      const errors: any = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: `${errors.errors[0].msg}` });
      }
      const { email, password, passwordAgain } = req.body;
      const token = req.query.token
      console.log(token);
      
      if (!token) {
        return res
          .status(301)
          .json({ message: 'Error, you don`t have a token' }); //Redirect /forgotpass
      }
      const tokenData = await AppDataSource.getRepository(pTokens).findOneBy({
        token: token.toString(),
      });
      if(!tokenData){
        return res.status(301).json({message: 'Your link is wrong'}) //REdirect /forgotpass
      }
      if (!(tokenData.expire > new Date())) {
        return res.status(301).json({message: 'Your link is expired'}) //Redirect /forgotpass
      }
      const user = await AppDataSource.getRepository(Users).findOneBy({
        email: email,
      });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      if (!(password === passwordAgain)) {
        return res.status(400).json({ message: 'Password mismatch' });
      }
      const userRepository = AppDataSource.getRepository(Users);
      const hashPassword = await hashAndVeridy.Hash(password, null);
      user.password = hashPassword;
      await userRepository.save(user);
      return res.json({ message: 'Password was changed' });
    } catch (err) {
      console.log('Error', err);
      return res.status(400).json({ message: 'Error' });
    }
  }

  async forgotpass(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await AppDataSource.getRepository(Users).findOneBy({
        email: email,
      });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const dateExpire = Date.now() + 3 * 60 * 1000;
      const tokensRepository = AppDataSource.getRepository(pTokens);
      const token = new pTokens();
      token.expire = new Date(dateExpire);
      token.user_id = user.user_id;
      await tokensRepository.save(token);

      const userData = mailPass.createData(email, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: token.token,
      });
      const data = mailPass.getData(userData);
      mg.messages.create(DOMAIN, data);

      return res.json({ message: 'Link was sent' });
    } catch (err) {
      console.log('Error', err);
      return res.status(400).json({ message: 'Error' });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await AppDataSource.getRepository(Users).findOneBy({
        email: email,
      });
      console.log(user);

      if (user) {
        const dateExpire = Date.now() + 60 * 1000;
        const tokensRepository = AppDataSource.getRepository(vTokens);
        const token = new vTokens();
        token.expire = new Date(dateExpire);
        token.user_id = user.user_id;
        await tokensRepository.save(token);
        const userData = mail.createData(email, {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          token: token.token,
        });
        const data = mail.getData(userData);
        mg.messages.create(DOMAIN, data);

        return res.json({ message: 'Link for verify was sent ' });
      }
      res.status(400).json({ message: 'User not found' });
    } catch (err) {
      console.log('Error', err);
      return res.status(400).json({ message: 'Error' });
    }
  }
}

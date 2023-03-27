import { Request, Response } from 'express';
import { Hash, Verify } from '../../services/hashAndVerify';
import { Mail } from '../../services/sendEmail';
import { mg } from '../../data_source';
import { v4 } from 'uuid';
import { ZodError } from 'zod';
import { SchemaLogin, SchemaSignUp, SchemaResetPass } from '../../components';
import { userRepository, tokensRepository } from '../../repository';
import { client } from '../../server';

const DOMAIN = process.env.MG_DOMAIN;

const mail = new Mail();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const fetchedLogin = SchemaLogin.parse(req.body);
      const { email, password } = fetchedLogin;
      const user = await userRepository.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const verify = await Verify(password, user.password);
      if (!verify) {
        return res.status(403).json({ message: 'Password incorrect' });
      }

      if (!user.verify) {
        return res.status(301).json({ message: 'You are not verified' }); 
      }

      const sessionId = v4();
      await client.set(sessionId, user.id, { EX: 10 * 60 });

      res.cookie('x-session-id', sessionId, {
        secure: false, //change
        httpOnly: true,
        expires: new Date(Date.now() + 90 * 60 * 1000),
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
      if (err instanceof ZodError) {
        console.log(err.message);
        return res.status(404).json({ message: err });
      }
      console.log('Error', err);
      res.status(400).json({ message: 'Login Error' });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const fetchedUser = SchemaSignUp.parse(req.body);
      const { email, firstName, lastName, password} = fetchedUser;
      const candidate = await userRepository.findByEmail(email);
      
      if (candidate) {
        return res
          .status(404)
          .json({ message: `This user with ${email} is exist` });
      }
      const hashPassword = await Hash(password, null);
      const user = await userRepository.save({
        email,
        firstName,
        lastName,
        verify: false,
        password: hashPassword,
      });

      const token = await tokensRepository.save({
        user_id: user.id,
        expire: new Date(Date.now() + 60 * 1000),
      });

      const userData = mail.createDataVerify(email, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: token.token,
      });
      const data = mail.getData(userData);
      mg.messages.create(DOMAIN, data);

      return res.json({ message: 'User registered successfully, mail sent' });
    } catch (err) {
      if (err instanceof ZodError) {
        console.log(err.message);
        return res.status(404).json({ message: err });
      }
      console.log('Error', err);
      return res.status(400).json({ message: 'Error' });
    }
  }

  async passwordReset(req: Request, res: Response) {
    try {
      const fetchedUser = SchemaResetPass.parse(req.body);
      const { email, password} = fetchedUser;
      const token = req.body.token;
      if (!token) {
        return res
          .status(301)
          .json({ message: 'Error, you don`t have a token' }); 
      }
      const tokenData = await tokensRepository.findByToken(token.toString());
      if (!tokenData) {
        return res.status(301).json({ message: 'Your link is wrong' }); 
      }
      tokensRepository.checkExpire();
      if (!(tokenData.expire > new Date())) {
        return res.status(301).json({ message: 'Your link is expired' }); 
      }
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const hashPassword = await Hash(password, null);
      user.password = hashPassword;
      await userRepository.save(user);
      return res.json({ message: 'Password was changed' });
    } catch (err) {
      if (err instanceof ZodError) {
        console.log(err.message);
        return res.status(404).json({ message: err });
      }
      console.log('Error', err);
      return res.status(500).json({ message: 'Error' });
    }
  }

  async forgotpass(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const token = await tokensRepository.save({
        user_id: user.id,
        expire: new Date(Date.now() + 3 * 60 * 1000),
      });

      const userData = mail.createDataRestore(email, {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: token.token,
      });
      const data = mail.getData(userData);
      mg.messages.create(DOMAIN, data);

      return res.json({ message: 'Link was sent' });
    } catch (err) {
      console.log('Error', err);
      return res.status(500).json({ message: 'Error' });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await userRepository.findByEmail(email);
      if (user) {
        const token = await tokensRepository.save({
          user_id: user.id,
          expire: new Date(Date.now() + 60 * 1000),
        });
        const userData = mail.createDataVerify(email, {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          token: token.token,
        });
        const data = mail.getData(userData);
        mg.messages.create(DOMAIN, data);

        return res.json({ message: 'Link for verify was sent ' });
      }
      return res.status(404).json({ message: 'User not found' });
    } catch (err) {
      console.log('Error', err);
      return res.status(500).json({ message: 'Error' });
    }
  }
}

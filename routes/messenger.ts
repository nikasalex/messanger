import { Router } from 'express';
import { AuthController } from './AuthController';
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { redirectIsAuthorized } from '../middlewares/redirectIsAuthorized';
import { Authmiddleware } from '../middlewares/Authmiddleware';
import { verifyUser } from '../middlewares/verifyUser';

const controller = new AuthController();
const router = Router();

router.get(
  '/',
  verifyUser,
  redirectIsAuthorized,
  (req: Request, res: Response) => {
    //res.cookie('x-session-id', '8bcd0d0f-1ecf-4361-b3f5-d7581b09694a',{secure: true, httpOnly: true} )
    res.send('Hello');
  }
);

router.post(
  '/',
  [check('email', 'This is must be Email').isEmail()],
  controller.login
);

router.post(
  '/forgotpass1',
  [
    check(
      'password',
      'Password must be mor than 4 and less than 10 character'
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.forgotpass1
);
router.post('/forgotpass', controller.forgotpass);

router.post(
  '/signup',
  [
    check('email', 'This is must be Email').isEmail(),
    check(
      'password',
      'Password must be mor than 4 and less than 10 character'
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.signup
);
router.post(
  '/verify',
  [check('email', 'This is must be Email').isEmail()],
  controller.verify
);

export = router;

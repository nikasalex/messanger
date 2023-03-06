import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Request, Response } from 'express';
import { check } from 'express-validator';
import { redirectIsAuthorized } from '../middlewares/redirectIsAuthorized';
import { verifyUser } from '../middlewares/verifyUser';
import { redirectIsNotAuthorized } from '../middlewares/redirectIsNotAuthorized';

const controller = new AuthController();
const router = Router();

router.get(
  '/',
  verifyUser,
  redirectIsAuthorized,
  (_req: Request, res: Response) => {
    res.send('Hello');
  }
);

router.get('/dashboard', redirectIsNotAuthorized, (_req: Request, res: Response) => {
  res.send('Dashboard');
})

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

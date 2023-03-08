import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Request, Response } from 'express';
import { redirectIsAuthorized } from '../../middlewares/redirectIsAuthorized';
import { verifyUser } from '../../middlewares/verifyUser';
import { redirectIsNotAuthorized } from '../../middlewares/redirectIsNotAuthorized';

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

router.get(
  '/dashboard',
  redirectIsNotAuthorized,
  (_req: Request, res: Response) => {
    res.send('Dashboard');
  }
);

router.post('/', controller.login);

router.post('/passwordreset', controller.passwordReset);
router.post('/forgotpass', controller.forgotpass);

router.post('/signup', controller.signup);
router.post('/verify', controller.verify);

export = router;

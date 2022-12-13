import { Router } from 'express';

import UserModel from '../models/user';
import { auth } from '../middlewares/verifyToken';
import { loginUser, registerUser } from '../controllers/user-controllers';
import { userValidation } from '../controllers/user-validator';

const router = Router();

router.post('/signup', userValidation, registerUser);
router.post('/login', loginUser);
router.get('/all', auth,
(_req, res, next) => {
  UserModel.find({}, {}, (err, users) => {
    if (err || !users) {
      res.status(401).send({ message: 'Unauthorized' });
      next(err);
    } else {
      res.json({ status: 'success', users: users });
    }
  });
}
);
export default router;

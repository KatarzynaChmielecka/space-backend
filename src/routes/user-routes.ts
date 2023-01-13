import { Router } from 'express';

import UserModel from '../models/user';
import {
  allNames,
  loginUser,
  logoutUser,
  patchAvatar,
  patchUserData,
  registerUser,
  userData,
} from '../controllers/user-controllers';
import { auth } from '../middlewares/verifyToken';
import { fileUpload } from '../middlewares/file-upload';
import { loginValidation } from '../controllers/login-validator';
import { userValidation } from '../controllers/user-validator';

const router = Router();

router.post(
  '/signup',
  fileUpload.single('avatar'),
  userValidation,
  registerUser,
);
router.post('/login', loginValidation, loginUser);
router.patch('/:id', auth, patchUserData);
router.patch('/:id/image', fileUpload.single('avatar'), auth, patchAvatar);
router.get('/logout', auth, logoutUser)
//test route
router.get('/all', auth, allNames);

router.get('/account', auth, userData);
export default router;

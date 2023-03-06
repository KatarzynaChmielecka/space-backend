import { Router } from 'express';

import UserModel from '../models/user';
import {
  allNames,
  loginUser,
  logoutUser,
  patchAvatar,
  patchUserEmail,
  patchUserName,
  patchUserPassword,
  postImage,
  registerUser,
  userData,
} from '../controllers/user-controllers';
import { auth } from '../middlewares/verifyToken';
import { fileUpload } from '../middlewares/file-upload';
import { loginValidation } from '../controllers/login-validator';
import { userValidation } from '../controllers/user-validator';
import { patchPasswordValidation } from '../controllers/patch-password-validator';
import { patchNameValidation } from '../controllers/patch-name-validator';

const router = Router();

router.post(
  '/signup',
  fileUpload.single('avatar'),
  userValidation,
  registerUser,
);
router.post('/login', loginValidation, loginUser);
router.post('/:id/images', fileUpload.single('images'), auth, postImage);
router.patch('/:id/name', auth, patchNameValidation, patchUserName);
router.patch('/:id/email', auth, patchUserEmail);
router.patch('/:id/password', auth, patchPasswordValidation, patchUserPassword);
router.patch('/:id/image', fileUpload.single('avatar'), auth, patchAvatar);
router.get('/logout', auth, logoutUser);
//test route
router.get('/all', auth, allNames);

router.get('/:id', auth, userData);
export default router;

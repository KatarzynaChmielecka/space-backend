import { Router } from 'express';

import UserModel from '../models/user';
import {
  allNames,
  loginUser,
  logoutUser,
  patchAvatar,
  patchUserName,
  postImage,
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
router.post('/:id/images', fileUpload.single('images'), auth, postImage);
router.patch('/:id/name', auth, patchUserName);
router.patch('/:id/image', fileUpload.single('avatar'), auth, patchAvatar);
router.get('/logout', auth, logoutUser);
//test route
router.get('/all', auth, allNames);

router.get('/:id', auth, userData);
export default router;

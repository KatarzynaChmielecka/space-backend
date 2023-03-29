import { Router } from 'express';

import UserModel from '../models/user';
import {
  allNames,
  deleteImage,
  loginUser,
  logoutUser,
  patchAvatar,
  patchUserEmail,
  patchUserName,
  patchUserPassword,
  postImage,
  postNote,
  registerUser,
  userData,
} from '../controllers/user-controllers';
import { auth } from '../middlewares/verifyToken';
import { fileUpload } from '../middlewares/file-upload';
import { imagesValidation } from '../controllers/images-validator';
import { loginValidation } from '../controllers/login-validator';
import { notesValidation } from '../controllers/notes-validator';
import { patchEmailValidation } from '../controllers/patch-email-validator';
import { patchImageValidation } from '../controllers/patch-image-validator';
import { patchNameValidation } from '../controllers/patch-name-validator';
import { patchPasswordValidation } from '../controllers/patch-password-validator';
import { userValidation } from '../controllers/user-validator';

const router = Router();

router.post(
  '/signup',
  fileUpload.single('avatar'),
  userValidation,
  registerUser,
);
router.post('/login', loginValidation, loginUser);
router.post('/:id/images', fileUpload.single('images'), auth, imagesValidation, postImage);
router.post('/:id/notes', auth, notesValidation, postNote);
router.patch('/:id/name', auth, patchNameValidation, patchUserName);
router.patch('/:id/email', auth, patchEmailValidation, patchUserEmail);
router.patch('/:id/password', auth, patchPasswordValidation, patchUserPassword);
router.patch('/:id/image', fileUpload.single('avatar'), auth, patchImageValidation, patchAvatar);
router.delete('/:id/images/:imageId', auth, deleteImage)
router.get('/logout', auth, logoutUser);
//test route
router.get('/all', auth, allNames);

router.get('/:id', auth, userData);
export default router;

import { Router } from 'express';

import UserModel from '../models/user';
import { allNames, loginUser, registerUser, userData } from '../controllers/user-controllers';
import { auth } from '../middlewares/verifyToken';
import { fileUpload } from '../middlewares/file-upload';
import { userValidation } from '../controllers/user-validator';

const router = Router();

router.post('/signup', fileUpload.single('avatar'), userValidation, registerUser);
router.post('/login', loginUser);

//test route
router.get('/all', auth, allNames);

router.get('/account', auth, userData);
export default router;

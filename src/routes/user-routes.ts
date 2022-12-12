import { Router } from 'express';

import {
    loginUser,
    registerUser
} from '../controllers/user-controllers';
import { userValidation } from '../controllers/user-validator';

const router = Router();

router.post('/signup', userValidation, registerUser);
router.post('/login', loginUser);
export default router;

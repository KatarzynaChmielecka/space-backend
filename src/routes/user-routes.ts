import { Router } from 'express';

import { registerUser } from '../controllers/user-controllers';
import { userValidation } from '../controllers/user-validator';

const router = Router();

router.post('/signup', userValidation, registerUser);

export default router;

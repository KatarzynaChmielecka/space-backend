import { Router } from 'express';

import { registerUser } from '../controllers/user-controllers';

const router = Router();

router.post('/signup', registerUser);


export default router
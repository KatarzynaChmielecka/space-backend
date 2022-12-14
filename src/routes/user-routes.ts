import { Router } from 'express';

import UserModel from '../models/user';
import { auth } from '../middlewares/verifyToken';
import { loginUser, registerUser } from '../controllers/user-controllers';
import { userValidation } from '../controllers/user-validator';

const router = Router();

router.post('/signup', userValidation, registerUser);
router.post('/login', loginUser);

router.get('/all', auth, (_req, res, next) => {
  UserModel.find({}, {}, (err, users) => {
    if (err || !users) {
      res.status(401).send({ message: 'Unauthorized' });
      next(err);
    } else {
      res.json({ status: 'success', users: users });
    }
  });
});

router.get('/:userId', auth, async (req, res) => {
  const userId=req.params.userId;

  let user;
  try {

      user= await UserModel.findById(userId);

      console.log(user!._id);
      console.log(req.user)
    } catch (err) {
      console.log(err)
    }

    if(!user){
      console.log('uuu')
    }

          if(userId===user?._id.toString()){
            res.status(200).json({user:user})
      } else {
      res.status(505).json({status:'fail'})
      }

  //-------------------------
  // let user;
  // if (req.user) {
  //   // użytkownik jest zalogowany, można odczytać jego dane z obiektu req.user
  //   user = req.user;
  //   // tutaj można wykonać operacje na danych użytkownika, np. wyświetlić jego profil
  //   console.log(req.user);
  //   res.render('profile', { user: user });
  // } else {
  //   // użytkownik nie jest zalogowany, należy przekierować go na stronę logowania
  //   // res.redirect('/login');
  //   console.log('lllllllllllllllllooooooooooooogin');
    
  //   res.status(503).json({status:'fail'})
  // }
});
export default router;

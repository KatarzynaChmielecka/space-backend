import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../models/http-error';
import { User } from '../models/user';

// export const getUsers = async (
//   req: any,
//   res: { json: (arg0: { users: UserInterface[] }) => any },
//   next: (arg0: HttpError) => unknown,
// ) => {
//   let users: UserInterface[];
//   try {
//     // '-password': It means that we don't want to fetch the password field from the database.
//     users = await User.find({}, '-password');
//   } catch (err) {
//     const error = new HttpError('Fetching users failed', 500);
//     return next(error);
//   }

//   //getters= pozbyć się id
//   res.json({ users: users.map((user) => user.toObject({ getters: true })) });
// };

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password, image } = req.body;

  let userExist;

  try {
    userExist = await User.findOne({ email: email });
  } catch (_err) {
    const error = new HttpError('Signing up failed, please try again later', 500);

    return next(error);
  }

  if (userExist) {
    const error = new HttpError(
      'User exists already, please login instead',
      422,
    );

    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image,
      // 'https://images.freeimages.com/images/large-previews/218/my-dog-cutter-1499799.jpg',
    // image: req.file.path.replace('\\', '/'),
    password,
  });

  try {
    await createdUser.save();
    console.log('yeee, działa')
  } catch (_err) {
    const error = new HttpError('Signing up failed', 500);
    // console.log(err.message);
    return next(error);
  }

  res.status(201).json(
    // {userId:createdUser.id, email:createdUser.email}
    );
};

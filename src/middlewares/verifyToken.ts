import { JwtPayload, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import UserModel from '../models/user';

interface UserToken extends JwtPayload {
  userId: string;
  mail: string;
}

interface CustomError extends Error {
  statusCode?: number;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  let err: CustomError;
  const token = req.headers.authorization?.split(' ')[1]; //authorization: 'Bearer TOKEN'
  try {
    if (!token) {
      err = new Error("You aren't allowed to get here");
      err.statusCode = 401;
      console.log('111:', err.message);
      throw err;
    }
    const decodedToken = verify(
      token,
      process.env.ACCESS_TOKEN as string,
    ) as UserToken;

    if (!decodedToken.userId) {
      err = new Error('Invalid token provided.');
      err.statusCode = 403;
      console.log('222:', err.message);
      throw err;
    }

    const user = await UserModel.findById(decodedToken.userId);

    if (user && !decodedToken.userId) {
      err = new Error('This token is no longer valid. Please sign in again.');
      err.statusCode = 400;
      console.log('333:', err.message);
      throw err;
    }

    next();
  } catch (err: any) {
    console.log('MIDDLEWARE ERROR:', err.message);
    return res
      .status(err.statusCode || 400)
      .json({ message: err.message || 'Oops! Something went wrong.' });
  }
};

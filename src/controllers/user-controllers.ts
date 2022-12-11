import passport from 'passport';
import { NextFunction, Request, Response } from 'express';

import { UserModel } from '../models/user';

export const registerUser = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  UserModel.register(
    new UserModel({
      username: req.body.username,
      email: req.body.email,
      image: req.body.image,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        if (req.body.email) {
          res.statusCode = 422;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: 'usera exista' });
        }
        return;
      } else {
        user.save((err: any, _user: any) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: 'something' });

            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    },
  );
};

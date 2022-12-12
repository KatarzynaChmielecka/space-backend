import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Request, Response } from 'express';

import UserModel from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
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
          res.json({ message: err.message });
        }
        return;
      } else {
        user.save((err: string) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: 'Something went wrong. Please try again later' });

            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, message: 'Welcome to the crew.' });
          });
        });
      }
    },
  );
};

export const loginUser = async (req: Request, res: Response) => {
  if (!req.body.email) {
    res.json({ success: false, message: 'Email is required' });
  } else if (!req.body.password) {
    res.json({ success: false, message: 'Password is required' });
  } else {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        res.json({ success: false, message: info.message });
      } else {
        if (!user) {
          res.json({
            message: info.message,
          });
        } else {
          const token = jwt.sign(
            { userId: user._id, username: user.username },
            `${process.env.ACCESS_TOKEN}`,
            { expiresIn: '24h' },
          );
          res.json({
            success: true,
            message: `Hello ${user.username}. You are logged in.`,
            token: token,
          });
        }
      }
    })(req, res);
  }
};

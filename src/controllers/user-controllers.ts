import jwt from 'jsonwebtoken';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';

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
            { expiresIn: '10m' }, //TODO:change it at the end
          );

          res.json({
            success: true,
            message: `Hello ${user.username}. You are logged in.`,
            token: token,
            user: user,
          });
        }
      }
    })(req, res);
  }
};

export const userData = async (req: Request, res: Response) => {
  let user;
  try {
    if (req.user !== undefined) {
      user = await UserModel.findById(req?.user.id);
    }
  } catch (err) {
    res.json(err);
  }
  res.status(200).json({ user: user });
};

export const allNames=(_req:Request, res: Response, next: NextFunction) => {
  UserModel.find({}, {username:1, _id:0}, (err, users) => {
    if (err || !users) {
      res.status(401).send({ message: 'Unauthorized' });
      next(err);
    } else {
      res.json({ status: 'success', users: users });
    }
  });
}
import jwt from 'jsonwebtoken';
import passport from 'passport';
import mongoose, { Types } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { nextTick } from 'process';

import UserModel, { UserDoc } from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
  const file = (req as { file?: any }).file;
  UserModel.register(
    new UserModel({
      username: req.body.username,
      email: req.body.email,
      avatar: file?.path.replace('\\', '/'),
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

export const logoutUser = (req: Request, res: Response, next: NextFunction) =>
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: `We couldn't logout you.` });
    } else {
      res.status(200).json({ success: true, message: 'See you soon! :)' });
    }
  });

export const patchAvatar = async (req: Request, res: Response) => {
  const file = (req as { file?: any }).file;
  const data = { avatar: file?.path.replace('\\', '/') };
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (user?._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this data.',
      });
    }

    await UserModel.findByIdAndUpdate(id, data);
    res
      .status(200)
      .json({ success: true, message: 'Your avatar was updated.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong with updating avatar',
    });
  }
};

export const patchUserData = async (req: Request, res: Response) => {
  const file = (req as { file?: any }).file;
  const data = {
    username: req.body.username,
    email: req.body.email,
  };

  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (user?._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this data.',
      });
    }

    await UserModel.findByIdAndUpdate(id, data);
    res.status(200).json({ success: true, message: 'Your data was updated.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong with updating data',
    });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required' });
  } else if (!password) {
    res.status(400).json({ success: false, message: 'Password is required' });
  } else {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        res.status(500).json({ success: false, message: info.message });
      } else {
        if (!user) {
          res.status(404).json({
            message: 'User does not exist. Maybe you want register instead?',
          });
        } else {
          req.login(user, function (err) {
            if (err) {
              res.json({ success: false, message: err });
            } else {
              const token = jwt.sign(
                { userId: user._id, username: user.username },
                `${process.env.ACCESS_TOKEN}`,
                { expiresIn: '1h' }, //TODO:change it at the end
              );

              res.status(200).json({
                success: true,
                message: `Hello ${user.username}. You are logged in.`,
                token: token,
                user: user,
              });
            }
          });
        }
      }
    })(req, res);
  }
};

export const userData = async (req: Request, res: Response) => {
  // let user: (UserDoc & { _id: Types.ObjectId }) | null = null;
  const { id } = req.params;

  const user = await UserModel.findById(id);
  try {
    if (user?._id.toString() === req.user?._id.toString()) {
      res.status(200).json({ user: user });
    }

    if (user?._id.toString() !== req.user?._id.toString()) {
      res.status(500).json({ success: false, message: 'You are not alllowed' });
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

export const allNames = (_req: Request, res: Response, next: NextFunction) => {
  UserModel.find({}, { username: 1, _id: 0 }, (err, users) => {
    if (err || !users) {
      res.status(401).send({ message: 'Unauthorized' });
      next(err);
    } else {
      res.json({ status: 'success', users: users });
    }
  });
};

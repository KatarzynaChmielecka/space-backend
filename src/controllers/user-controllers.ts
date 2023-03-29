import jwt from 'jsonwebtoken';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';

import UserModel from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
  const file = (req as { file?: any }).file;

  if (req.body.password !== req.body.passwordConfirmation) {
    res.status(400).json({
      message: 'Passwords are different',
    });
    return;
  }
  
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

export const logoutUser = (req: Request, res: Response) =>
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

export const patchUserName = async (req: Request, res: Response) => {
  const data = {
    username: req.body.username,
  };

  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user?._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this data.',
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({ success: true, message: 'Your name was updated.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong with updating data',
    });
  }
};

export const patchUserEmail = async (req: Request, res: Response) => {
  const data = {
    email: req.body.email,
  };

  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user?._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this data.',
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, data);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({ success: true, message: 'Your email was updated.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong with updating data',
    });
  }
};

export const patchUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password, newPassword, newPasswordConfirmation } = req.body;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user?._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this password.',
      });
    }

    if (newPassword !== newPasswordConfirmation) {
      return res
        .status(400)
        .json({ message: 'New password and confirmation do not match.' });
    }

    user.authenticate(password, (_err, user, passwordErr) => {
      if (passwordErr) {
        if (passwordErr.name === 'IncorrectPasswordError') {
          return res.status(403).json({
            success: false,
            message: "Old password isn't good",
          });
        } else {
          return res.status(500).json({
            success: false,
            message: 'Something went wrong with updating password',
          });
        }
      }

      user?.changePassword(password, newPasswordConfirmation);
      res
        .status(200)
        .json({ success: true, message: 'Your password was updated.' });
    });
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
                { expiresIn: '1h' },
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

export const postImage = async (req: Request, res: Response) => {
  const file = (req as { file?: any }).file;

  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (user?._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to add image.',
      });
    }

    const newImage = {
      imageUrl: file.path,
    };

    user?.images?.push(newImage);
    await user?.save();
    res.status(201).json({ success: true, message: 'Your image was added.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        'Something went wrong during adding image. Please try again later.',
    });
  }
};

export const postNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (user?._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to add note.',
      });
    }

    const note = {
      createdAt: new Date(),
      text: req.body.note,
    };

    user?.notes?.push(note);
    await user?.save();
    res.status(201).json({ success: true, message: 'Your note was added.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        'Something went wrong during adding note. Please try again later.',
    });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id, imageId } = req.params;
    const user = await UserModel.findById(id);

    if (user?._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to delete image.',
      });
    }

    if (user?.images) {
      const imageIndex = user.images.findIndex(
        (image) => image._id!.toString() === imageId,
      );
      if (imageIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Image not found.',
        });
      }

      user.images.splice(imageIndex, 1);
    }
    await user?.save();
    res.status(204).json({ success: true, message: 'Your image was deleted.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        'Something went wrong during deleting image. Please try again later.',
    });
  }
};

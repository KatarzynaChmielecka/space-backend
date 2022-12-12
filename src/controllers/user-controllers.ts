import jwt from 'jsonwebtoken';
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

// router.post("/login", function (req, res) {
// if (!req.body.username) {
//     res.json({ success: false, message: "Username was not given" })
// }
// else if (!req.body.password) {
//     res.json({ success: false, message: "Password was not given" })
// }
// else {
//     passport.authenticate("local", function (err, user, info) {
//         if (err) {
//             res.json({ success: false, message: err });
//         }
//         else {
//             if (!user) {
//                 res.json({ success: false, message: "username or password incorrect" });
//             }
//             else {
//                 const token = jwt.sign({ userId: user._id, username: user.username }, secretkey, { expiresIn: "24h" });
//                 res.json({ success: true, message: "Authentication successful", token: token });
//             }
//         }
//     })(req, res);
// }
// });

export const loginUser = async (req:Request, res:Response) => {
  if (!req.body.email) {
    res.json({ success: false, message: 'Email was not given' });
  } else if (!req.body.password) {
    res.json({ success: false, message: 'Password was not given' });
  } else {
    passport.authenticate('local', function (err, user,) {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        if (!user) {
          res.json({
            success: false,
            message: 'email or password incorrect',
          });
        } else {
          const token = jwt.sign(
            { userId: user._id, username: user.username },
            `${process.env.ACCESS_TOKEN}`,
            { expiresIn: '24h' },
          );
          res.json({
            success: true,
            message: 'Authentication successful',
            token: token,
          });
        }
      }
    })(req, res);
  }
};

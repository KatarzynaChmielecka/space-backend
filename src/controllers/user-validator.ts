import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const validation = Joi.object({
  username: Joi.string().min(2).required(),
  email: Joi.string().email().trim(true).required().messages({
    'string.email': 'Please check your email. Maybe you forgot to use "@"?',
  }),
  password: Joi.string().min(8).trim(true).required(),
  image: Joi.string().required(),
});

export const userValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    image: req.body.image,
  };

  const { error } = validation.validate(payload, { abortEarly: false });

  if (error !== null && error !== undefined) {
    return res
      .status(406)
      .json({ message: 'Validation failed', errors: error.details });
  }

  next();
};

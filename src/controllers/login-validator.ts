import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const validation = Joi.object({
  email: Joi.string().email().trim(true).required().messages({
    'string.email': 'Please check your email. Maybe you forgot to use "@"?',
  }),
  password: Joi.string().min(8).trim(true).required(),
});

export const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };

  const { error } = validation.validate(payload, { abortEarly: false });

  if (error !== null && error !== undefined) {
    return res
      .status(406)
      .json({ message: 'Validation failed', errors: error.details });
  }

  next();
};

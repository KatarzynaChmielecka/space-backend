import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const validation = Joi.object({
  //   username: Joi.string().min(2).required(),
  //   email: Joi.string().email().trim(true).required().messages({
  //     'string.email': 'Please check your email. Maybe you forgot to use "@"?',
  //   }),
  //   password: Joi.string().min(8).trim(true).required(),
  //   passwordConfirmation: Joi.any().valid(Joi.ref('password')).required().messages({'any.only':'Passwords are different'}),
  images: Joi.string().required(),
});

export const imagesValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //   const file = (req as { file?: any }).file;
  const { file } = req;
  const payload = {
    images: file?.path,
  };

  const { error } = validation.validate(payload, { abortEarly: false });

  if (error !== null && error !== undefined) {
    return res
      .status(406)
      .json({ message: 'Validation failed', errors: error.details });
  }

  next();
};

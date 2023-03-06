import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const validation = Joi.object({
  password: Joi.string().min(8).trim(true).required(),
  newPassword: Joi.string().min(8).trim(true).required(),
  newPasswordConfirmation: Joi.any()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({ 'any.only': 'Passwords are different' }),
});

export const patchPasswordValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = {
    password: req.body.password,
    newPassword: req.body.newPassword,
    newPasswordConfirmation: req.body.newPasswordConfirmation,
  };

  const { error } = validation.validate(payload, { abortEarly: false });

  if (error !== null && error !== undefined) {
    return res
      .status(406)
      .json({ message: 'Validation failed', errors: error.details });
  }

  next();
};

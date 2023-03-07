import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const validation = Joi.object({
  avatar: Joi.string().required(),
});

export const patchImageValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { file } = req;
  const payload = {
    avatar: file?.path,
  };

  const { error } = validation.validate(payload, { abortEarly: false });

  if (error !== null && error !== undefined) {
    return res
      .status(406)
      .json({ message: 'Validation failed', errors: error.details });
  }

  next();
};

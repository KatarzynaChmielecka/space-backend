import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const validation = Joi.object({
  images: Joi.string().required(),
});

export const imagesValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

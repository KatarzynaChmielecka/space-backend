import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const validation = Joi.object({
  note: Joi.string().min(20).trim(true).required(),
});

export const notesValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = {
    note: req.body.note,
  };

  const { error } = validation.validate(payload, { abortEarly: false });

  if (error !== null && error !== undefined) {
    return res
      .status(406)
      .json({ message: 'Validation failed', errors: error.details });
  }

  next();
};

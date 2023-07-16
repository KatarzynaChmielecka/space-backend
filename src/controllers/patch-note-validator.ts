import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const validation = Joi.object({
    text: Joi.string().min(20).trim(true).required(),

});

export const patchNoteValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const payload = {
        text: req.body.text,

    };

    const { error } = validation.validate(payload, { abortEarly: false });

    if (error !== null && error !== undefined) {
        return res
            .status(406)
            .json({ message: 'Validation failed', errors: error.details });
    }

    next();
};
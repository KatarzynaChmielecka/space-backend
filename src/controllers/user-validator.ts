import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

// import { HttpError } from '../models/http-error';

const validation = Joi.object({
  name: Joi.string()
    .min(2)
    .required()
    .messages({
      'string.name':
        'Name is required, and it should have at least 2 characters',
    }),
  email: Joi.string()
    .email()
    .trim(true)
    .required()
    .messages({
      'string.email': 'Please check your email. Maybe you forgot to use "@"?',
    }),
  password: Joi.string()
    .min(8)
    .trim(true)
    .required()
    .messages({ 'string.password': 'Password should have 8 characters' }),
  image: Joi.string().required(),
});

export const userValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    image:req.body.image,
  };

  const { error } = validation.validate(payload, { abortEarly: false });

  // if (error) {
  //   let errorMessages = '';

  //   error.details.forEach((errorDetail) => {
  //     errorMessages += `${errorDetail.message}. `;
  //   });

  //   console.log(errorMessages);
  //   return res.status(406).json({ message: errorMessages });
  // }

  if (error !== null && error!== undefined) {
    return res
      .status(406)
      .json({ message: 'Validation failes', errors: error.details });
  }

  next();
};

// import Joi from 'joi';
// import { NextFunction, Request, Response } from 'express';

// // import { HttpError } from '../models/http-error';

// const validation = Joi.object({
//   name: Joi.string().min(2).required().messages({'string.name':'Name is required, and it should have at least 2 characters'}),
//   email: Joi.string().email().trim(true).required().messages({'string.email':'Please check your email. Maybe you forgot to use "@"?'}),
//   password: Joi.string().min(8).trim(true).required().messages({'string.password':'Password should have 8 characters'}),
//   image: Joi.string().required(),
// });

// export const userValidation = async (req:Request, res:Response, next:NextFunction) => {
//   const payload = {
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     image: req.body.image,
//   };

//   const { error } = validation.validate(payload);

//   // if (error) {
//   //   return res.status(406).json({
//   //     message: 'Validation failed',
//   //     errors: error.details
//   //   });
//   // }

//   if (error) {
//     let errorMessages = '';

//     error.details.forEach((errorDetail) => {
//       errorMessages += `${errorDetail.message}. `;
//     });

//     console.log(errorMessages);
//     return res.status(406).json({ message: errorMessages });
//   }

//   if (error !== null && error !== undefined) {
//     return res
//       .status(406)
//       .json({ message: 'Validation failes', errors: error!.details });
//   }

//   next();
// }
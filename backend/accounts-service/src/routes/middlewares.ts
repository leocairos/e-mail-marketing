import { Request, Response } from 'express';
import Joi from 'joi';

import { accountSchema, loginSchema } from '../models/account';

function validateSchema(schema: Joi.ObjectSchema<any>, req: Request, res: Response, next: any) {
  const { error } = schema.validate(req.body);

  if (!error) {
    return next()
  } else {

    const message = error?.details.map(item => item.message).join(',');
    console.log('validateSchema', message);
    res.status(422).end();
  }
}

function validateAccount(req: Request, res: Response, next: any) {
  return validateSchema(accountSchema, req, res, next);
}

function validateLogin(req: Request, res: Response, next: any) {
  return validateSchema(loginSchema, req, res, next);
}

export { validateAccount, validateLogin }
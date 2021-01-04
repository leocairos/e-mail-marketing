import { Request, Response } from 'express';
import Joi from 'joi';
import authAccount from '../auth/accountsAuth';
import microservicesAuth from '../auth/microservicesAuth';
import authMicroservice from '../auth/microservicesAuth';

function validateSchema(schema: Joi.ObjectSchema<any>, req: Request, res: Response, next: any) {
  const { error } = schema.validate(req.body);

  if (!error) {
    return next()
  } else {

    const message = error?.details.map(item => item.message).join(',');
    console.log('validateSchema', message);
    res.status(422).json({
      entity: req.body,
      message
    });
  }
}

async function validateAccountAuth(req: Request, res: Response, next: any) {
  try {
    const token = req.headers['x-access-token'] as string;
    if (!token) return res.sendStatus(401);

    const payload = await authAccount.verify(token);
    if (!payload) return res.sendStatus(401);

    res.locals.payload = payload;
    next();
  } catch (error) {
    console.log(`validateAccountAuth: ${error}`)
    return res.sendStatus(400);
  }
}

async function validateMicroserviceAuth(req: Request, res: Response, next: any) {
  try {
    const token = req.headers['x-access-token'] as string;
    if (!token) return res.sendStatus(401);

    const payload = await microservicesAuth.verify(token);
    if (!payload) return res.sendStatus(401);

    res.locals.payload = payload;
    next();
  } catch (error) {
    console.log(`validateMicroserviceAuth: ${error}`)
    return res.sendStatus(400);
  }
}

export default { validateSchema, validateAccountAuth, validateMicroserviceAuth }
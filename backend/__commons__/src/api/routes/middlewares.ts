import { Request, Response } from 'express';
import Joi from 'joi';
import auth from '../auth';

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

async function validateAuth(req: Request, res: Response, next: any) {
  try {
    const token = req.headers['x-access-token'] as string;
    if (!token) return res.status(401).end();

    const payload = await auth.verify(token);
    if (!payload) return res.status(401).end();

    res.locals.payload = payload;
    next();
  } catch (error) {
    console.log(`validate: ${error}`)
  }
}

export default { validateSchema, validateAuth }
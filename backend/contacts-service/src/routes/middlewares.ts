import { Request, Response } from 'express';
import commonsMiddlerware from 'ms-commons/api/routes/middlewares';

import { contactSchema, contactUpdateSchema } from '../models/contactSchemas';

function validateContactSchema(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateSchema(contactSchema, req, res, next);
}

function validateUpdateContactSchema(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateSchema(contactUpdateSchema, req, res, next);
}

export {
  validateContactSchema,
  validateUpdateContactSchema,
}
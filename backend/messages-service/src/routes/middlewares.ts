import { Request, Response } from 'express';
import commonsMiddlerware from 'ms-commons/api/routes/middlewares';

import { messageSchema, messageUpdateSchema } from '../models/messageSchemas';

function validateMessageSchema(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateSchema(messageSchema, req, res, next);
}

function validateUpdateMessageSchema(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateSchema(messageUpdateSchema, req, res, next);
}

export {
  validateMessageSchema,
  validateUpdateMessageSchema,
}
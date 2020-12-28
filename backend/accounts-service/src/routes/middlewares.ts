import { Request, Response } from 'express';
import commonsMiddlerware from 'ms-commons/api/routes/middlewares';
import controllerCommons from 'ms-commons/api/controllers/controller';
import { Token } from 'ms-commons/api/auth';

import { accountSchema, accountUpdateSchema, loginSchema } from '../models/accountSchemas';
import { accountEmailSchema, accountEmailUpdateSchema } from '../models/accountEmailSchemas';

function validateAccountSchema(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateSchema(accountSchema, req, res, next);
}

function validateUpdateAccountSchema(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateSchema(accountUpdateSchema, req, res, next);
}

function validateLoginSchema(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateSchema(loginSchema, req, res, next);
}

async function validateAuthentication(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateAuth(req, res, next);
}

async function validateAuthorization(req: Request, res: Response, next: any) {
  const accountId = parseInt(req.params.id);
  if (!accountId) return res.status(400).end();

  const token = controllerCommons.getToken(res) as Token;
  if (accountId !== token.accountId) return res.status(403).end();

  next();
}

function validateAccountEmailSchema(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateSchema(accountEmailSchema, req, res, next);
}

function validateAccountUpdateEmailSchema(req: Request, res: Response, next: any) {
  return commonsMiddlerware.validateSchema(accountEmailUpdateSchema, req, res, next);
}

export {
  validateAccountSchema,
  validateUpdateAccountSchema,
  validateLoginSchema,
  validateAuthentication,
  validateAuthorization,
  validateAccountEmailSchema,
  validateAccountUpdateEmailSchema
}
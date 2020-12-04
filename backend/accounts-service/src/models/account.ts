import { AccountStatus } from './accountStatus';
import Joi from 'joi';

export interface IAccount {
  id: number;
  name: string;
  email: string;
  password: string;
  status: AccountStatus;
}

const accountSchema = Joi.object({
  id: Joi.number()
    .integer()
    .min(1),
  name: Joi.string()
    .min(3)
    .max(150)
    .required(),
  email: Joi.string()
    .email()
    .min(8)
    .max(150)
    .required(),
  password: Joi.string()
    .min(8)
    .max(50)
    .required(),
  status: Joi.number()
    .integer()
    .min(100)
    .max(400)
})

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .min(8)
    .max(150)
    .required(),
  password: Joi.string()
    .min(8)
    .max(50)
    .required()
})

export { accountSchema, loginSchema }
import Joi from 'joi';

const messageSchema = Joi.object({
  id: Joi.number()
    .integer()
    .min(1),
  accountId: Joi.number()
    .integer()
    .min(1),
  accountEmailId: Joi.number()
    .integer()
    .min(1)
    .required(),
  subject: Joi.string()
    .min(3)
    .max(150)
    .required(),
  body: Joi.string()
    .min(8)
    .max(65535)
    .required(),
  sendDate: Joi.date(),
  status: Joi.number()
    .integer()
    .min(100)
    .max(300),
});

const messageUpdateSchema = Joi.object({
  subject: Joi.string()
    .min(3)
    .max(150),
  body: Joi.string()
    .min(8)
    .max(65535),
  accountEmailId: Joi.number()
    .integer()
    .min(1),
  sendDate: Joi.date(),
  status: Joi.number()
    .integer()
    .min(100)
    .max(300),
});


export { messageSchema, messageUpdateSchema }
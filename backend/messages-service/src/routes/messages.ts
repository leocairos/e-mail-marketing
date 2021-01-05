import { Router } from 'express';
import middlewaresCommons from 'ms-commons/api/routes/middlewares';

import {
  validateMessageSchema, validateUpdateMessageSchema, validateSendingSchema
} from './middlewares';

import controller from '../controllers/messages'

const router = Router();

router.get('/messages/:id',
  middlewaresCommons.validateAccountAuth, controller.getMessage);
router.get('/messages/',
  middlewaresCommons.validateAccountAuth, controller.getMessages);

router.post('/messages/',
  middlewaresCommons.validateAccountAuth, validateMessageSchema,
  controller.addMessage);

router.patch('/messages/:id',
  middlewaresCommons.validateAccountAuth, validateUpdateMessageSchema,
  controller.setMessage);

router.delete('/messages/:id',
  middlewaresCommons.validateAccountAuth, controller.deleteMessage);

router.post('/messages/:id/send',
  middlewaresCommons.validateAccountAuth, controller.scheduleMessage);

router.post('/messages/sending',
  middlewaresCommons.validateMicroserviceAuth,
  validateSendingSchema,
  controller.sendMessage);

export default router; 
import { Router } from 'express';
import middlewaresCommons from 'ms-commons/api/routes/middlewares';

import { validateContactSchema, validateUpdateContactSchema } from '../routes/middlewares';

import contactsController from '../controllers/contacts'

const router = Router();

router.get('/contacts/:id', middlewaresCommons.validateAccountAuth, contactsController.getContact)

router.get('/contacts/', middlewaresCommons.validateAccountAuth, contactsController.getContacts)

router.post('/contacts/',
  middlewaresCommons.validateAccountAuth, validateContactSchema,
  contactsController.addContact)

router.patch('/contacts/:id',
  middlewaresCommons.validateAccountAuth, validateUpdateContactSchema,
  contactsController.setContact)

router.delete('/contacts/:id', middlewaresCommons.validateAccountAuth, contactsController.deleteContact)

export default router; 
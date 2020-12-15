import { Router } from 'express';
import middlewaresCommons from 'ms-commons/api/routes/middlewares';

import { validateContactSchema, validateUpdateContactSchema } from '../routes/middlewares';

import contactsController from '../controllers/contacts'

const router = Router();

router.get('/contacts/:id', middlewaresCommons.validateAuth, contactsController.getContact)

router.get('/contacts/', middlewaresCommons.validateAuth, contactsController.getContacts)

router.post('/contacts/',
  middlewaresCommons.validateAuth, validateContactSchema,
  contactsController.addContact)

router.patch('/contacts/:id',
  middlewaresCommons.validateAuth, validateUpdateContactSchema,
  contactsController.setContact)

router.get('/health', (req, res, next) => {
  res.json({ message: 'Contacts API is up and running!' });
})

export default router; 
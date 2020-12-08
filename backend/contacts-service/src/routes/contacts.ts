import { Router } from 'express';
import middlewaresCommons from 'ms-commons/api/routes/middlewares';
import contactsController from '../controllers/contacts'

const router = Router();

router.get('/contacts/:id', middlewaresCommons.validateAuth, contactsController.getContact)

router.get('/contacts/', middlewaresCommons.validateAuth, contactsController.getContacts)

export default router;
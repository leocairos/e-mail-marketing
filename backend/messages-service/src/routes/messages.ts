import { Router } from 'express';
import middlewaresCommons from 'ms-commons/api/routes/middlewares';

//import { validateMessageSchema, validateUpdateMessageSchema } from '../routes/middlewares';

import controller from '../controllers/messages'

const router = Router();

router.get('/messages/', middlewaresCommons.validateAuth, controller.getMessages)

export default router; 
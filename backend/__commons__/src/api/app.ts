import express, { Router } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import logger from 'morgan';

export default (router: Router) => {
  const app = express();
  const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  };

  app.use(logger('dev'));
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(bodyParser.json());

  app.use(router);

  return app;
}

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import accountesRouter from './routes/accounts';

const app = express();
app.use(helmet());
app.use(bodyParser.json());

app.use(accountesRouter);

const port = parseInt(`${process.env.PORT}`);
app.listen(port);

console.log(`[Accounts] Micro Service running on port ${port}...`)
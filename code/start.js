// start.js setup from learnnode.com by Wes Bos
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });

import proxyRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import cors from 'cors';

const app = express();

// support json encoded and url-encoded bodies, mainly used for post and update


app.use('/', proxyRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter)

app.set('port', process.env.PORT || 3010);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});

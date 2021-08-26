import express from 'express';
import {json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from '@dfacilitiesorg/common';
import { NotFoundError } from '@dfacilitiesorg/common';

const app = express();
// added this to make sure express knows our server sits behind nginx 
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError()
});

app.use(errorHandler);

export {app};
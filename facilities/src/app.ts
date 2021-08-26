import express from 'express';
import {json} from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {createFacilityTicketRouter} from './routes/new';

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

app.use(createFacilityTicketRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError()
});

app.use(errorHandler);

export {app};
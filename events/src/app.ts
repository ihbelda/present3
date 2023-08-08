import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@anei/common';

import { indexEventRouter } from './routes/index';
import { newEventRouter } from './routes/new';
import { updateEventRouter } from './routes/update';
import { showEventRouter } from './routes/show';
import { launchEventRouter } from './routes/launch';
import { closeEventRouter } from './routes/close';

import { subscribeMemberRouter } from './routes/member/subscribe';
import { newEventMemberRouter } from './routes/member/new';
import { showMemberRouter } from './routes/member/show';
import { deleteMemberRouter } from './routes/member/delete';



const app = express();
app.set('trust proxy', true); // trust even coming from a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: process.env.NODE_ENV !== 'test' // To use when put https in production
  })
);
app.use(currentUser);

app.use(indexEventRouter);
app.use(newEventRouter);
// app.use(updateEventRouter); // TODO
app.use(showEventRouter);
app.use(launchEventRouter);
app.use(closeEventRouter);
app.use(updateEventRouter);

// app.use(indexMemberRouter); // TODO
// app.use(updateMemberRouter); // TODO
app.use(subscribeMemberRouter);
app.use(newEventMemberRouter);
app.use(showMemberRouter);
app.use(deleteMemberRouter);


// If you introduce a bad uri path (all methods get, post, ...)
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

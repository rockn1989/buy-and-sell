'use strict';

const express = require(`express`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const offersRouter = require(`./routes/offers`);

const app = express();

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);

app.listen(8080);

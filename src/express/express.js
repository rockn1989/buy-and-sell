'use strict';
const path = require(`path`);
const express = require(`express`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const offersRouter = require(`./routes/offers`);
const {HttpCode} = require(`../constants`);

const app = express();

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);

app.use(express.static(path.resolve(__dirname, `public`)));

app.use((req, res, next) => {
  res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  next();
});

app.use((error, req, res, next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`, {error});
  next();
});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(8080);

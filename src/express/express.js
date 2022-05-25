'use strict';
const path = require(`path`);
const express = require(`express`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const offersRouter = require(`./routes/offers`);
const {HttpCode} = require(`../constants`);

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();
app.use(express.urlencoded({extended: false}));

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/offers`, offersRouter);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).render(`errors/404`);
});

// app.use((error, req, res) => {
//   res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`, {error});
// });

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(8080);

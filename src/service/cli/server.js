'use strict';

const express = require(`express`);
const {getLogger} = require(`../lib/logger`);
const routes = require(`../api`);
const {DEFAULT_PORT, HttpCode} = require(`../../constants`);

const logger = getLogger({name: `api`});

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });

  next();
});

app.use(`/api`, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`Request error: ${err}`);
});

module.exports = {
  name: `--server`,
  run(args) {
    const port = parseInt(args, 10) || DEFAULT_PORT;

    app
      .listen(port, () => {
        logger.info(`Ожидаю соединения на порт: ${port}`);
      }).on(`error`, ({message}) => {
        logger.error(`Ошибка при создании сервера ${message}`);
      });
  }
};

'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const routes = require(`../api`);
const {DEFAULT_PORT} = require(`../../constants`);

const app = express();
app.use(express.json());

app.use(`/api`, routes);


module.exports = {
  name: `--server`,
  run(args) {
    const port = parseInt(args, 10) || DEFAULT_PORT;

    app
      .listen(port, () => {
        console.info(chalk.green(`Ожидаю соединения на порт: ${port}`));
      }).on(`error`, ({message}) => {
        console.log(chalk.red(`Ошибка при создании сервера ${message}`));
      });
  }
};

'use strict';

const express = require(`express`);
const fs = require(`fs/promises`);
const chalk = require(`chalk`);
const {DEFAULT_PORT, HttpCode} = require(`../../constants`);

const app = express();
app.use(express.json());

app.get(`/offers`, async (req, res) => {
  try {
    const dataMock = await fs.readFile(`mocks.json`, `utf8`);
    const content = JSON.parse(dataMock);
    res.status(HttpCode.OK).json(content);
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).send([]);
  }
});

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

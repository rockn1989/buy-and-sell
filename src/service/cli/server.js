'use strict';

const http = require(`http`);
const fs = require(`fs/promises`);
const chalk = require(`chalk`);
const {DEFAULT_PORT, HttpCode} = require(`../../constants`);

const sendTemplate = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/`:
      try {
        const dataMock = await fs.readFile(`mocks.json`, `utf8`);
        const content = JSON.parse(dataMock);
        const titles = content.map(({title}) => `<li>${title}</li>`).join(``);
        sendTemplate(res, HttpCode.OK, titles);
      } catch (err) {
        sendTemplate(res, HttpCode.NOT_FOUND, `Not found`);
      }
      break;
    default:
      sendTemplate(res, HttpCode.NOT_FOUND, `Not found`);
      break;
  }

};

module.exports = {
  name: `--server`,
  run(args) {
    const port = parseInt(args, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port, () => {
        console.info(chalk.green(`Ожидаю соединения на порт: ${port}`));
      }).on(`error`, ({message}) => {
        console.log(chalk.red(`Ошибка при создании сервера ${message}`));
      });
  }
};

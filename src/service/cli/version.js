'use strict';

const path = require(`path`);
const packageJsonFile = require(path.resolve(`./package.json`));

module.exports = {
  name: `--version`,
  run: () => {
    return console.info(packageJsonFile.version);
  }
};

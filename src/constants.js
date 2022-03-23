'use strict';

const path = require(`path`);

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;

const MIN_POST = 1;
const MAX_POST = 1000;

const PATH_OF_TITLES = path.resolve(`./data/titles.txt`);
const PATH_OF_DESCRIPTIONS = path.resolve(`./data/descriptions.txt`);
const PATH_OF_CATEGORIES = path.resolve(`./data/categories.txt`);

const ExitCode = {
  SUCCESS: 1,
  ERROR: 0
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MIN_POST,
  MAX_POST,
  PATH_OF_TITLES,
  PATH_OF_DESCRIPTIONS,
  PATH_OF_CATEGORIES,
  ExitCode
};

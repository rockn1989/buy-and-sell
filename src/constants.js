'use strict';

const path = require(`path`);

const DEFAULT_COMMAND = `--help`;

const DEFAULT_PORT = 3000;

const USER_ARGV_INDEX = 2;

const MIN_POST = 1;
const MAX_POST = 1000;

const OFFERS_PER_PAGE = 8;

const PATH_OF_TITLES = path.resolve(`./data/titles.txt`);
const PATH_OF_DESCRIPTIONS = path.resolve(`./data/descriptions.txt`);
const PATH_OF_CATEGORIES = path.resolve(`./data/categories.txt`);
const PATH_OF_COMMENTS = path.resolve(`./data/comments.txt`);
const PATH_OF_API_LOG = `./logs/api.log`;

const ExitCode = {
  SUCCESS: 1,
  ERROR: 0
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  DEFAULT_COMMAND,
  DEFAULT_PORT,
  USER_ARGV_INDEX,
  OFFERS_PER_PAGE,
  MIN_POST,
  MAX_POST,
  PATH_OF_TITLES,
  PATH_OF_DESCRIPTIONS,
  PATH_OF_CATEGORIES,
  PATH_OF_COMMENTS,
  PATH_OF_API_LOG,
  ExitCode,
  HttpCode,
  Env
};

'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  res.send(`main page`);
});

mainRouter.get(`/register`, async (req, res) => {
  res.send(`Hello register`);
});

mainRouter.get(`/login`, async (req, res) => {
  res.send(`Hello login`);
});

mainRouter.get(`/search`, async (req, res) => {
  res.send(`Hello search`);
});

module.exports = mainRouter;

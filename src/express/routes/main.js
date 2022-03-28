'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  res.render(`pages/main`);
});

mainRouter.get(`/register`, async (req, res) => {
  res.render(`pages/sign-up`);
});

mainRouter.get(`/login`, async (req, res) => {
  res.render(`pages/login`);
});

mainRouter.get(`/search`, async (req, res) => {
  res.render(`pages/search-result`);
});

module.exports = mainRouter;

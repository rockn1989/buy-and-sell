'use strict';

const {Router} = require(`express`);

const offersRouter = new Router();
offersRouter.get(`/add`, async (req, res) => {
  res.send(`Hello add`);
});

offersRouter.get(`/:id`, async (req, res) => {
  res.send(`Hello offers`);
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  res.send(`Hello edit offer`);
});

offersRouter.get(`/category/:id`, async (req, res) => {
  res.send(`Hello category offer`);
});

module.exports = offersRouter;

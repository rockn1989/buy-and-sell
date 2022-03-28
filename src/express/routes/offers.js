'use strict';

const {Router} = require(`express`);

const offersRouter = new Router();
offersRouter.get(`/add`, async (req, res) => {
  res.render(`pages/ticket/ticket-new`);
});

offersRouter.get(`/:id`, async (req, res) => {
  res.render(`pages/ticket/ticket-detail`);
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  res.render(`pages/ticket/ticket-edit`);
});

offersRouter.get(`/category/:id`, async (req, res) => {
  res.render(`pages/category`);
});

module.exports = offersRouter;

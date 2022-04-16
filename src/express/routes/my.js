'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const myRouter = new Router();

const api = getAPI();

myRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`pages/my-tickets`, {offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const comments = await api.getComments();
  res.render(`pages/comments`, {comments});
});

module.exports = myRouter;

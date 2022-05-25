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
  const offers = await api.getOffers({comments: true});
  res.render(`pages/comments`, {offers});
});

myRouter.post(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    await api.deleteOffer(id);
    res.redirect(`/my`);
  } catch (err) {
    const errorMessage = err.message;
    const offers = await api.getOffers({comments: false});
    res.render(`pages/my-tickets`, {offers, errorMessage});
  }
});

module.exports = myRouter;

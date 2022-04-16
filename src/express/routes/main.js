'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const mainRouter = new Router();


const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [offers, categories] = await Promise.all([
    api.getOffers(),
    api.getCategories()
  ]);
  res.render(`pages/main`, {offers, categories});
});

mainRouter.get(`/register`, async (req, res) => {
  res.render(`pages/sign-up`);
});

mainRouter.get(`/login`, async (req, res) => {
  res.render(`pages/login`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {query: searchValue} = req.query;

  try {
    const offers = await api.search(searchValue);
    res.render(`pages/search-result`, {offers, searchValue});
  } catch (err) {
    res.render(`pages/search-result`, {offers: []});
  }
});


module.exports = mainRouter;

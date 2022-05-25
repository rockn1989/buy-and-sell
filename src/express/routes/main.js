'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {OFFERS_PER_PAGE} = require(`../../constants`);
const mainRouter = new Router();


const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [offers, categories] = await Promise.all([
    api.getOffers({limit: OFFERS_PER_PAGE}),
    api.getCategories({count: true})
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
    const [results, offers] = await Promise.all([
      api.search(searchValue),
      api.getOffers({limit: OFFERS_PER_PAGE})
    ]);

    res.render(`pages/search-result`, {searchValue, results, offers});
  } catch (err) {
    const offers = await api.getOffers({limit: OFFERS_PER_PAGE});
    res.render(`pages/search-result`, {results: [], offers});
  }
});


module.exports = mainRouter;

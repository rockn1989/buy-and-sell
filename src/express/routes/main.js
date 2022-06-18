'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {OFFERS_PER_PAGE} = require(`../../constants`);
const mainRouter = new Router();
const upload = require(`../middleware/upload`);

const api = getAPI();

mainRouter.get(`/`, async (req, res) => {

  const page = parseInt(req.query.page, 10) || 1;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * limit;

  const [{offers, count}, categories] = await Promise.all([
    api.getOffers({limit, page, offset}),
    api.getCategories({count: true})
  ]);

  res.render(`pages/main`, {offers, categories, limit, page, count});
});

mainRouter.get(`/register`, async (req, res) => {
  res.render(`pages/sign-up`);
});

mainRouter.get(`/login`, async (req, res) => {
  res.render(`pages/login`);
});

mainRouter.get(`/sign-up`, async (req, res) => {
  res.render(`pages/sign-up`);
});

mainRouter.post(`/sign-up`, upload.single(`avatar`), async (req, res) => {
  const data = {
    firstname: req.body[`firstname`],
    lastname: req.body[`lastname`],
    email: req.body[`email`],
    password: req.body[`password`],
    passwordRepeated: req.body[`password-repeated`],
    avatar: req.file ? req.file.filename : ``
  };

  try {
    await api.createUser(data);
    res.redirect(`/login`);
  } catch (err) {
    const {errorsList} = err.response.data;
    res.render(`pages/sign-up`, {errorsList});
  }

});

mainRouter.get(`/search`, async (req, res) => {
  const {query: searchValue} = req.query;
  try {
    const [results, {offers}] = await Promise.all([
      api.search(searchValue),
      api.getOffers({limit: OFFERS_PER_PAGE})
    ]);

    res.render(`pages/search-result`, {searchValue, results, offers});
  } catch (err) {

    const {offers} = await api.getOffers({limit: OFFERS_PER_PAGE});
    res.render(`pages/search-result`, {results: [], offers});
  }
});


module.exports = mainRouter;

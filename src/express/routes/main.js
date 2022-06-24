'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const {getAPI} = require(`../api`);
const {OFFERS_PER_PAGE} = require(`../../constants`);
const mainRouter = new Router();
const upload = require(`../middleware/upload`);

const csrfProtection = csrf();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * limit;

  const [{offers, count}, categories] = await Promise.all([
    api.getOffers({limit, page, offset}),
    api.getCategories({count: true})
  ]);

  res.render(`pages/main`, {offers, categories, limit, page, count, user});
});

mainRouter.get(`/sign-up`, csrfProtection, async (req, res) => {
  res.render(`pages/sign-up`, {csrfToken: req.csrfToken()});
});

mainRouter.get(`/login`, csrfProtection, async (req, res) => {
  res.render(`pages/login`, {csrfToken: req.csrfToken()});
});

mainRouter.post(`/login`, csrfProtection, async (req, res) => {

  const data = {
    email: req.body[`email`],
    password: req.body[`password`]
  };

  try {
    const userData = await api.auth(data);

    req.session.user = userData;
    req.session.save(() => {
      res.redirect(`/`);
    });

  } catch (err) {
    const {errorsList} = err.response.data;
    const {user} = req.session;
    res.render(`pages/login`, {errorsList, user, csrfToken: req.csrfToken()});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  const sid = req.cookies.s_user.replace(`s:`, ``);
  req.session.destroy(sid, () => {
    res.clearCookie(`s_user`);

  });
  res.redirect(`/login`);

});

mainRouter.get(`/sign-up`, async (req, res) => {
  res.render(`pages/sign-up`);
});

mainRouter.post(`/sign-up`, [upload.single(`avatar`), csrfProtection], async (req, res) => {
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
    res.render(`pages/sign-up`, {errorsList, csrfToken: req.csrfToken()});
  }

});

mainRouter.get(`/search`, async (req, res) => {
  const {query: searchValue} = req.query;
  const {user} = req.session;
  try {
    const [results, {offers}] = await Promise.all([
      api.search(searchValue),
      api.getOffers({limit: OFFERS_PER_PAGE})
    ]);

    res.render(`pages/search-result`, {searchValue, results, offers, user});
  } catch (err) {
    const {offers} = await api.getOffers({limit: OFFERS_PER_PAGE});
    res.render(`pages/search-result`, {results: [], offers, user});
  }
});


module.exports = mainRouter;

'use strict';

const fs = require(`fs/promises`);
const {Router} = require(`express`);
const offers = require(`./offers`);
const category = require(`./category`);
const search = require(`./search`);

const OfferService = require(`../data-service/offers-service`);
const CategoryService = require(`../data-service/category-service`);
const CommentService = require(`../data-service/comments-service`);
const SearchService = require(`../data-service/search-service`);

const app = new Router();


(async () => {
  const dataMock = await fs.readFile(`mocks.json`, `utf8`);
  const mock = JSON.parse(dataMock);

  offers(app, new OfferService(mock), new CommentService(mock));
  category(app, new CategoryService(mock));
  search(app, new SearchService(mock));
})();

module.exports = app;

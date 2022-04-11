'use strict';

const {Router} = require(`express`);
const offers = require(`./offers`);
const category = require(`./category`);
const search = require(`./search`);

const OfferService = require(`../data-service/offers-service`);
const CategoryService = require(`../data-service/category-service`);
const CommentService = require(`../data-service/comments-service`);
const SearchService = require(`../data-service/search-service`);

const getMockData = require(`../lib/get-mock-data`);

const app = new Router();


(async () => {
  const mock = await getMockData();

  offers(app, new OfferService(mock), new CommentService(mock));
  category(app, new CategoryService(mock));
  search(app, new SearchService(mock));
})();

module.exports = app;

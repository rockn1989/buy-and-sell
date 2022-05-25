'use strict';

const {Router} = require(`express`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const offers = require(`./offers`);
const category = require(`./category`);
const search = require(`./search`);

const OfferService = require(`../data-service/offers-service`);
const CategoryService = require(`../data-service/category-service`);
const CommentService = require(`../data-service/comments-service`);
const SearchService = require(`../data-service/search-service`);

defineModels(sequelize);

const app = new Router();

(async () => {
  offers(app, new OfferService(sequelize), new CommentService(sequelize));
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;

'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {

    this._https = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._https.request({url, ...options});
    return response.data;
  }

  async getCategories() {
    return await this._load(`/categories`);
  }

  async getOffers() {
    return this._load(`/offers`);
  }

  async getOffer(id) {
    return this._load(`/offers/${id}`);
  }

  async getComments() {
    const offers = await this.getOffers();
    const comments = offers.map((item) => item.comments);

    return comments.flat();
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

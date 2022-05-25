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

  async getCategories(count) {
    return await this._load(`/categories`, {
      params: count
    });
  }

  async getCategory(id) {
    return await this._load(`/categories/${id}`);
  }

  async getOffers({limit, comments} = {}) {
    return this._load(`/offers`, {
      params: {limit, comments}
    });
  }

  async getOffer(id, comments) {
    return this._load(`/offers/${id}`, {
      params: comments
    });
  }

  async createComment(id, data) {
    return this._load(`/offers/${id}/comments`, {
      method: `POST`,
      data
    });
  }

  async getComments() {
    return this._load(`/comments`);
  }

  async deleteComment(offerId, commentId) {
    return this._load(`/offers/${offerId}/comments/${commentId}`, {
      method: `DELETE`
    });
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

  async editOffer(id, offerData) {
    return this._load(`/offers/${id}`, {
      method: `PUT`,
      data: offerData
    });
  }

  async deleteOffer(id) {
    return this._load(`/offers/${id}`, {
      method: `DELETE`
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

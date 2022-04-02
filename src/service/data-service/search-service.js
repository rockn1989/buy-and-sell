'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  async findAll(query) {
    const result = this._offers.filter(({title}) => title.toLowerCase().includes(query.toLowerCase()));

    if (result.length === 0) {
      return null;
    }

    return result;
  }
}

module.exports = SearchService;

'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  async findAll() {
    const categories = this._offers.reduce((prev, next) => {
      return new Set([...prev, ...next.category]);
    }, []);

    return [...categories];
  }
}

module.exports = CategoryService;

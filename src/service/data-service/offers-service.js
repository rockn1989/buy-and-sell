'use strict';

const {nanoid} = require(`nanoid`);

class OfferService {
  constructor(offers) {
    this._offers = offers;
  }
  async findAll() {
    return this._offers;
  }

  async findOne(id) {
    const offer = this._offers.find((item) => item.id === id);

    if (!offer) {
      return null;
    }

    return offer;
  }

  async create(offer) {
    const newOffer = Object.assign({id: nanoid(), comments: []}, offer);
    this._offers.push(newOffer);

    return newOffer;
  }

  async drop(id) {
    const offer = await this.findOne(id);

    if (!offer) {
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);

    return offer;
  }

  async update(id, offer) {
    const oldOffer = await this.findOne(id);

    if (!oldOffer) {
      return null;
    }
    console.log(oldOffer);
    return Object.assign(oldOffer, offer);
  }
}


module.exports = OfferService;

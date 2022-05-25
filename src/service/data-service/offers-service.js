'use strict';

const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
    this._Comment = sequelize.models.Comment;
  }
  async findAll({comments}) {

    const options = {
      include: [{
        model: this._Category,
        as: Aliase.CATEGORIES
      }],
      order: [
        [`createdAt`, `DESC`]
      ]
    };

    if (comments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [{
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }]
      });
      options.order = [
        [Aliase.COMMENTS, `createdAt`, `DESC`]
      ];
    }

    const offers = await this._Offer.findAll(options);

    return offers.map((item) => item.get());
  }

  async findOne({offerId, comments}) {

    const options = {
      include: [
        Aliase.CATEGORIES, {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ]
    };

    if (comments) {
      options.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [{
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }]
      });
      options.order = [
        [Aliase.COMMENTS, `createdAt`, `DESC`]
      ];
    }

    let offer;

    try {
      offer = await this._Offer.findByPk(offerId, options);
    } catch (err) {
      return false;
    }

    if (!offer) {
      return !!offer;
    }

    return offer;
  }

  async create(offer) {
    const newOffer = await this._Offer.create({...offer, userId: 3});

    try {
      await newOffer.addCategories(offer.category);
    } catch (err) {
      return err.message;
    }

    return newOffer;
  }

  async drop(id) {
    let offerId;

    try {
      offerId = await this._Offer.destroy({
        where: {id}
      });

    } catch (err) {
      return false;
    }

    if (!offerId) {
      return !!offerId;
    }

    return offerId;
  }

  async update(offerId, offerData) {
    let affectedRow;
    let updateOffer;

    try {
      affectedRow = await this._Offer.update(offerData, {
        where: {id: offerId}
      });
    } catch (err) {
      return false;
    }

    try {
      updateOffer = await this._Offer.findOne({
        where: {id: offerId}
      });

      await updateOffer.setCategories(offerData.category);
    } catch (err) {
      return false;
    }

    return affectedRow;
  }
}


module.exports = OfferService;

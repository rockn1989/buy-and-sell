'use strict';

const {nanoid} = require(`nanoid`);

class CommentService {
  constructor(offers) {
    this._offers = offers;
  }

  async findAll(id) {
    const offerComments = this._offers.find((item) => item.id === id);
    return offerComments.comments;
  }

  async findOne(offerId, commentId) {
    const offer = this._offers.find((item) => item.id === offerId);

    const comment = offer.comments.find((item) => item.id === commentId);

    return comment;
  }

  async drop(offerId, commentId) {
    const offer = this._offers.find((item) => item.id === offerId);

    if (!offer) {
      return null;
    }

    const comment = offer.comments.find((item) => item.id === commentId);

    if (!comment) {
      return null;
    }

    offer.comments = offer.comments.filter((item) => item.id !== commentId);

    return comment;
  }

  async create(offerId, comment) {
    const offer = this._offers.find((item) => item.id === offerId);
    const newComment = {id: nanoid(), text: comment};

    offer.comments.push(newComment);

    return newComment;
  }
}


module.exports = CommentService;

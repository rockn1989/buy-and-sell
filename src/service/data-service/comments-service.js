'use strict';

class CommentService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
  }

  async findAll(offerId) {
    return this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }

  async findOne(offerId, commentId) {
    const comment = await this._Comment.findOne({
      where: {
        id: commentId,
        offerId
      },
      raw: true
    });

    return comment;
  }

  async drop(offerId, commentId) {

    try {
      const offer = await this._Offer.findByPk(offerId);

      if (!offer) {
        return false;
      }

      const commentRow = await this._Comment.destroy({
        where: {
          id: commentId
        }
      });

      return commentRow;
    } catch (err) {
      return false;
    }
  }

  async create(offerId, comment) {
    try {
      const commentRow = await this._Comment.create({offerId, ...comment});
      return commentRow;
    } catch (err) {
      return false;
    }
  }
}


module.exports = CommentService;

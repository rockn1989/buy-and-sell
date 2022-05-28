'use strict';

const {Router} = require(`express`);
const offerExists = require(`../middleware/offer-exists`);
const offerValidator = require(`../middleware/offer-validator.js`);
const commentValidator = require(`../middleware/comment-validator.js`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {limit, offset, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await offerService.findPage({limit, offset});
    } else {
      result = await offerService.findAll({comments});
    }


    if (!result) {
      return res.status(HttpCode.FORBIDDEN).send(`Something wrong`);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const {comments} = req.query;

    const offer = await offerService.findOne({offerId, comments});

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).json(offer);
  });

  route.get(`/:offerId/comments`, [offerExists(offerService)], async (req, res) => {
    const {offerId} = req.params;
    let offerComments;

    try {
      offerComments = await commentService.findAll(offerId);
    } catch (err) {
      return res.status(HttpCode.FORBIDDEN).send(err);
    }

    return res.status(HttpCode.OK).json(offerComments);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const result = await offerService.create(req.body);

    res.status(HttpCode.CREATED).json(result);
  });

  route.put(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const result = await offerService.update(offerId, req.body);

    if (!result) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).send(`update`);
  });

  route.delete(`/:offerId`, [offerExists(offerService)], async (req, res) => {
    const {offerId} = req.params;

    try {
      await offerService.drop(offerId);
    } catch (err) {
      return res.status(HttpCode.FORBIDDEN).send(`Error: ${err}`);
    }

    return res.status(HttpCode.DELETED).send(`deleted`);
  });

  route.post(`/:offerId/comments`, [offerExists(offerService)], async (req, res) => {
    const {offerId} = req.params;

    const comment = await commentService.create(offerId, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, [offerExists(offerService)], async (req, res) => {
    const {offerId, commentId} = req.params;
    const comment = await commentService.drop(offerId, commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`No comment`);
    }

    return res.status(HttpCode.DELETED).send(`deleted`);
  });

  route.post(`/:offerId/comments`, commentValidator, async (req, res) => {
    const {offerId} = req.params;

    const comment = await commentService.create(offerId, req.body);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`not found`);
    }
    return res.status(HttpCode.CREATED).send(comment);
  });

};

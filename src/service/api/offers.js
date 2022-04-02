'use strict';

const {Router} = require(`express`);
const offerValidator = require(`../middleware/offer-validator.js`);
const commentValidator = require(`../middleware/comment-validator.js`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const offers = await offerService.findAll();

    res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    const offer = await offerService.findOne(id);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {

    const offer = {
      id: 1,
      type: `offer`,
      title: `test`,
      description: `hellow world`,
      sum: 4534,
      picture: `offer-01.jpg`,
      category: [`Game`]
    };

    const result = await offerService.create(offer);

    res.status(HttpCode.CREATED).json(result);
  });

  route.put(`/:id`, async (req, res) => {
    const {id} = req.params;
    const result = await offerService.update(id, {title: `ARTEEEM`});

    if (!result) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).send(`update`);
  });

  route.delete(`/:id`, async (req, res) => {
    const {id} = req.params;
    const offer = await offerService.findOne(id);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    const deletedOffer = await offerService.drop(id);

    if (!deletedOffer) {
      return res.status(HttpCode.FORBIDDEN).send(`Not found width ${id}`);
    }

    return res.status(HttpCode.OK).send(`deleted`);
  });

  route.get(`/:id/comments`, async (req, res) => {
    const {id} = req.params;
    const offer = await offerService.findOne(id);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    const offerComments = await commentService.findAll(id);

    return res.status(HttpCode.OK).json(offerComments);
  });

  route.delete(`/:offerId/comments/:commentId`, async (req, res) => {
    const {offerId, commentId} = req.params;
    const comment = commentService.findOne(offerId, commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`No comment`);
    }

    const deletedComment = await commentService.drop(offerId, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.FORBIDDEN).send(`Not found with ${commentId}`);
    }

    return res.status(HttpCode.DELETED).send(`deleted`);
  });

  route.post(`/:offerId/comments`, commentValidator, async (req, res) => {
    const {offerId} = req.params;

    const comment = await commentService.create(offerId, req.body);

    return res.status(HttpCode.CREATED).send(comment);
  });

};

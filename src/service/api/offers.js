'use strict';

const {Router} = require(`express`);
const offerExists = require(`../middleware/offer-exists`);
const offerValidator = require(`../middleware/offer-validator.js`);
const commentValidator = require(`../middleware/comment-validator.js`);
const routeValidator = require(`../middleware/route-validator.js`);
const {HttpCode} = require(`../../constants`);
const OfferSchema = require(`../schema/offer-schema`);
const CommentSchema = require(`../schema/comment-schema`);
const RouteSchema = require(`../schema/route-schema`);

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

  route.get(`/comments`, async (req, res) => {
    const {userId} = req.query;

    const offers = await offerService.findUserOffers(userId);

    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, [routeValidator(RouteSchema), offerExists(offerService)], async (req, res) => {
    const {offerId} = req.params;
    const {comments} = req.query;

    const offer = await offerService.findOne({offerId, comments});

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).json(offer);
  });

  route.get(`/:offerId/comments`, [routeValidator(RouteSchema), offerExists(offerService)], async (req, res) => {
    const {offerId} = req.params;
    let offerComments;

    try {
      offerComments = await commentService.findAll(offerId);
    } catch (err) {
      return res.status(HttpCode.FORBIDDEN).send(err);
    }

    return res.status(HttpCode.OK).json(offerComments);
  });

  route.post(`/`, offerValidator(OfferSchema), async (req, res) => {
    const result = await offerService.create(req.body);

    res.status(HttpCode.CREATED).json(result);
  });

  route.put(`/:offerId`, [routeValidator(RouteSchema), offerExists(offerService), offerValidator(OfferSchema)], async (req, res) => {
    const {offerId} = req.params;
    const result = await offerService.update(offerId, req.body);

    if (!result) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    }

    return res.status(HttpCode.OK).send(`update`);
  });

  route.delete(`/:offerId`, [routeValidator(RouteSchema), offerExists(offerService)], async (req, res) => {
    const {offerId} = req.params;

    try {
      await offerService.drop(offerId);
    } catch (err) {
      return res.status(HttpCode.FORBIDDEN).send(`Error: ${err}`);
    }

    return res.status(HttpCode.DELETED).send(`deleted`);
  });

  route.post(`/:offerId/comments`, [routeValidator(RouteSchema), offerExists(offerService), commentValidator(CommentSchema)], async (req, res) => {
    const {offerId} = req.params;
    const comment = await commentService.create(offerId, req.body);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`not found`);
    }
    return res.status(HttpCode.CREATED).send(comment);

  });

  route.delete(`/:offerId/comments/:commentId`, [routeValidator(RouteSchema), offerExists(offerService)], async (req, res) => {
    const {offerId, commentId} = req.params;
    const comment = await commentService.drop(offerId, commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`No comment`);
    }

    return res.status(HttpCode.DELETED).send(`deleted`);
  });

};

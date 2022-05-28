'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const offersRouter = new Router();
const api = getAPI();
const upload = require(`../middleware/upload`);
const {OFFERS_PER_PAGE} = require(`../../constants`);

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`pages/ticket/ticket-new`, {categories});
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const offer = await api.getOffer(id, {comments: true});

  res.render(`pages/ticket/ticket-detail`, {offer});
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);

  offer.categories = offer.categories.map((item) => item.name);
  res.render(`pages/ticket/ticket-edit`, {offer, categories});

});

offersRouter.get(`/category/:id`, async (req, res) => {
  const {id} = req.params;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * limit;

  const {category, count, offersByCategory} = await api.getCategory(id, {limit, offset});
  res.render(`pages/category`, {offersByCategory, limit, page, count, category});
});

offersRouter.post(`/add`, upload.single(`picture`), async (req, res) => {

  const offerData = {
    title: req.body.title,
    description: req.body.description,
    category: Array.isArray(req.body.category) ? req.body.category : [req.body.category],
    sum: req.body.sum,
    type: req.body.type,
    picture: req.file.filename ? req.file.filename : ``
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (err) {
    const categories = await api.getCategories();
    res.render(`pages/ticket/ticket-new`, {categories, err});
  }

});

offersRouter.post(`/edit/:id`, upload.single(`picture`), async (req, res) => {
  const {id} = req.params;

  const offerData = {
    title: req.body.title,
    description: req.body.description,
    category: Array.isArray(req.body.category) ? req.body.category : [req.body.category],
    sum: req.body.sum,
    type: req.body.type,
    picture: req.file ? req.file.filename : req.body[`old-picture`]
  };

  try {
    await api.editOffer(id, offerData);
    res.redirect(`/my`);
  } catch (err) {
    const handleError = err.respose.data;
    const [offer, categories] = await Promise.all([
      api.getOffer(id),
      api.getCategories()
    ]);
    res.render(`pages/ticket/ticket-edit`, {offer, categories, handleError});
  }

});

offersRouter.post(`/:offerId`, async (req, res) => {
  const {offerId} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(offerId, {userId: 3, text: comment});
    res.redirect(`/offers/${offerId}`);
  } catch (err) {
    const offer = await api.getOffer(offerId, {comments: true});
    res.render(`pages/ticket/ticket-detail`, {offer});
  }
});

offersRouter.post(`/:offerId/comments/:commentId`, async (req, res) => {
  const {offerId, commentId} = req.params;

  try {
    await api.deleteComment(offerId, commentId);
    res.redirect(`/my/comments`);
  } catch (err) {
    const offer = await api.getOffer(offerId);
    res.render(`pages/ticket/ticket-detail`, {offer});
  }
});

module.exports = offersRouter;

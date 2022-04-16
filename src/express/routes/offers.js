'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const offersRouter = new Router();
const api = getAPI();
const upload = require(`../middleware/upload`);

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`pages/ticket/ticket-new`, {categories});
});

offersRouter.get(`/:id`, async (req, res) => {
  res.render(`pages/ticket/ticket-detail`);
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [offer, categories] = await Promise.all([
      api.getOffer(id),
      api.getCategories()
    ]);

    res.render(`pages/ticket/ticket-edit`, {offer, categories});
  } catch (err) {
    const handleError = err.respose.data;
    res.render(`pages/ticket/ticket-edit`, {handleError});
  }

});

offersRouter.get(`/category/:id`, async (req, res) => {
  res.render(`pages/category`);
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {

  const offerData = {
    title: req.body.title,
    description: req.body.description,
    category: Array.isArray(req.body.category) ? req.body.category : [req.body.category],
    sum: req.body.sum,
    type: req.body.type,
    avatar: req.file.originalname
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (err) {
    const categories = await api.getCategories();
    res.render(`pages/ticket/ticket-new`, {categories, err});
  }

});

module.exports = offersRouter;

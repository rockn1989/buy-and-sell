'use strict';

const {Router} = require(`express`);

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  res.send(`Hello my`);
});

myRouter.get(`/comments`, async (req, res) => {
  res.send(`Hello comments`);
});

module.exports = myRouter;

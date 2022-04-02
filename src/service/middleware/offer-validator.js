'use strict';

const {HttpCode} = require(`../../constants`);

const offerKeys = [`category`, `description`, `picture`, `title`, `type`, `sum`];

const offerValidator = (req, res, next) => {
  const newOffer = req.body;
  const keys = Object.keys(newOffer);
  const keyExists = offerKeys.every((key) => keys.includes(key));

  if (!keyExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`bad request`);
  }

  return next();
};

module.exports = offerValidator;

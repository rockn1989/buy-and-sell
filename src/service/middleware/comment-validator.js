'use strict';

const {HttpCode} = require(`../../constants`);

const commentValidator = (req, res, next) => {
  const comment = req.body;

  if (comment.length === 0) {
    return res.status(HttpCode.BAD_REQUEST).send(`Comment is empty`);
  }

  return next();
};

module.exports = commentValidator;

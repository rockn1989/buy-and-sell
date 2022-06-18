'use strict';

const {Router} = require(`express`);
const passwordUtils = require(`../lib/password`);
const {HttpCode} = require(`../../constants`);
const userValidator = require(`../middleware/user-validator`);
const UserSchema = require(`../schema/user-schema`);
const {REGISTER_FORBIDDEN_ERROR} = require(`../../constants`);

module.exports = (app, userService) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/register`, userValidator(UserSchema, userService), async (req, res) => {
    const data = req.body;
    data.passwordHash = await passwordUtils.hash(data.password);

    try {
      const user = await userService.create(data);

      if (!user) {
        return res.status(HttpCode.FORBIDDEN).send({errorsList: [REGISTER_FORBIDDEN_ERROR]});
      }
    } catch (error) {
      return res.status(HttpCode.FORBIDDEN).send({errorsList: [REGISTER_FORBIDDEN_ERROR]});
    }
    return res.status(HttpCode.CREATED).send(`Ok`);
  });
};

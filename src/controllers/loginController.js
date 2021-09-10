const express = require('express');
const loginMW = require('../middlewares/loginMW');

const LoginRouter = express.Router();

LoginRouter.post('/', loginMW.logUser);

module.exports = LoginRouter;

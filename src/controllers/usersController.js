const express = require('express');
const usersService = require('../services/usersService');

// variavel routerUsers vai receber
// uma estrutura de rotas
const routerUsers = express.Router();
const HTTP_SERVERERROR_STATUS = 500; 

routerUsers.post('/', async (req, res, next) => {
  try {
    const user = await usersService.create(req.body);
    if (user.err) {
      return next(user);
    }
    return res.status(user.status).json({ user: user.user });
  } catch (error) {
    return res.status(HTTP_SERVERERROR_STATUS).json(error);
  }
});

// exportando as rotas que vai ser usada
// no app
module.exports = routerUsers;
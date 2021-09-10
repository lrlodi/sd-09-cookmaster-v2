const express = require('express');
const usersMW = require('../middlewares/usersMW');

const UsersRouter = express.Router();

UsersRouter.get('/', usersMW.getAllUsers);

UsersRouter.post('/', usersMW.createNewUser);

module.exports = UsersRouter;

const express = require('express');
const bodyParser = require('body-parser');
const { sendErrorMessage } = require('./middwares/errors');
const usersController = require('./controllers/users');

const app = express();
app.use(bodyParser.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.post('/users', usersController.create);

app.post('/login', usersController.login);

app.use(sendErrorMessage);

module.exports = app;

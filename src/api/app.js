const express = require('express');
const bodyParser = require('body-parser').json();
const router = require('../routes/router');
const errorMw = require('../middlewares/errorMW');

const app = express();
app.use(bodyParser);
app.use(router);
app.use(errorMw);
// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador
module.exports = app;

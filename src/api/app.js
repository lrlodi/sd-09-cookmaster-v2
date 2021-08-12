const express = require('express');
const bodyParser = require('body-parser');
const validateJWT = require('./auth/validateJWT');

const userControllers = require('../controllers/userControllers');
const recipesControllers = require('../controllers/recipesControllers');

const app = express();
app.use(bodyParser.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.post('/users', userControllers.postUser);
app.post('/login', userControllers.postLogin);
app.post('/recipes', validateJWT, recipesControllers.postRecipes);

module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');
const validateJWT = require('./auth/validateJWT');
const Users = require('./controllers/Users');
const Recipes = require('./controllers/Recipes');
const middleware = require('./middleware/error');

const app = express();

app.use(bodyParser.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.post('/users', Users.registerUser);

app.post('/login', Users.loginUser);

app.post('/recipes', validateJWT, Recipes.registerRecipe);

app.get('/recipes', Recipes.listRecipes);

app.get('/recipes/:id', Recipes.getRecipeById);

app.put('/recipes/:id', validateJWT, Recipes.editRecipe);

app.delete('/recipes/:id', validateJWT, Recipes.deleteRecipe);

app.use(middleware);

module.exports = app;

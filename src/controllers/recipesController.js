const express = require('express');
const authToken = require('../middlewares/authToken');

const recipesMW = require('../middlewares/recipesMW');

const RecipesRouter = express.Router();

RecipesRouter.get('/', recipesMW.getAllRecipes);
RecipesRouter.get('/:id', recipesMW.getRecipeById);

RecipesRouter.post('/',
  authToken,
  recipesMW.validateRecipe,
  recipesMW.postRecipe);

RecipesRouter.put('/:id',
  authToken,
  recipesMW.validateRecipe,
  recipesMW.allowEditing,
  recipesMW.updateRecipe);

  RecipesRouter.delete('/:id',
  authToken,
  recipesMW.allowEditing,
  recipesMW.deleteRecipe);

  RecipesRouter.put('/:id/image',
  authToken,
  recipesMW.checkRecipeId,
  recipesMW.allowEditing,
  recipesMW.upload.single('image'),
  recipesMW.insertImage);

module.exports = RecipesRouter;
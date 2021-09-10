const joi = require('joi');
const { ObjectId } = require('mongodb');
const RecipesModel = require('../models/recipesModel');
const response = require('../middlewares/responseCodes');

const genError = (errorCode, message) => ({
  errorCode,
  message,
});

const RECIPE_SCHEMA = joi.object({
  name: joi.string().required(),
  ingredients: joi.string().required(),
  preparation: joi.string().required(),
});

const validateRecipe = (recipeInfo) => {
    const { error } = RECIPE_SCHEMA.validate(recipeInfo);
    if (error) {
      throw genError(response.BAD_REQUEST, 'Invalid entries. Try again.');
    }
    return null;
  };

const postRecipe = async (recipeInfo, userInfo) => {
  try {
    const newRecipe = await RecipesModel.postRecipe(recipeInfo, userInfo);
    return newRecipe;
  } catch (error) {
    return error;
  }
};

const getAllRecipes = async () => RecipesModel.getAllRecipes();

const getRecipeById = async (recipeId) => {
  if (!ObjectId.isValid(recipeId)) throw genError(response.NOT_FOUND, 'recipe not found');
  const foundRecipe = await RecipesModel.getRecipeById(recipeId);
  if (!foundRecipe) throw genError(response.NOT_FOUND, 'recipe not found');
  return foundRecipe;
};

const updateRecipe = async (recipeId, recipeInfo) => (
  RecipesModel.updateRecipe(recipeId, recipeInfo)
);

module.exports = {
  postRecipe,
  validateRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
};

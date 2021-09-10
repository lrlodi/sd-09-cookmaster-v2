const path = require('path');
const multer = require('multer');
const RecipesServices = require('../services/recipesServices');
const RecipesModel = require('../models/recipesModel');
const response = require('./responseCodes');

const validateRecipe = (req, res, next) => {
  try {
    const recipeInfo = req.body;
    RecipesServices.validateRecipe(recipeInfo);
    return next();    
  } catch (error) {
    return next(error);
  }
};

const postRecipe = async (req, res, next) => {
  const recipeInfo = req.body;
  const { user } = req;
  const newRecipe = await RecipesServices.postRecipe(recipeInfo, user);
  if (newRecipe.error) return next(newRecipe);
  return res.status(response.STATUS_CREATED).json({ recipe: newRecipe });
};

const getAllRecipes = async (req, res) => {
  try {
    const registeredRecipes = await RecipesServices.getAllRecipes();
    return res.status(response.STATUS_OK).json(registeredRecipes);
  } catch (error) {
    return error;
  }
};

const getRecipeById = async (req, res, next) => {
  const recipeId = req.params.id;
  try {
    const foundRecipe = await RecipesServices.getRecipeById(recipeId);
    return res.status(response.STATUS_OK).json(foundRecipe);
  } catch (error) {
    return next(error);
  }
};

const checkRecipeId = async (req, res, next) => {
  const recipeId = req.params.id;
  const recipeFound = await RecipesModel.getRecipeById(recipeId);
  if (!recipeFound) return next({ errorCode: response.NOT_FOUND, message: 'recipe not found' });
  return next();
};

const allowEditing = async (req, res, next) => {
  const { _id: loggedId, role } = req.user;
  const { userId } = await RecipesServices.getRecipeById(req.params.id);
  if (!userId || !loggedId) {
    return next({ errorCode: response.UNAUTHORIZED, message: 'jwt malformed' });
  }
  const idtest = loggedId.toString();
  const idtest2 = userId.toString();
  if (role === 'admin') return next();
  if (idtest !== idtest2) {
    console.log(idtest, idtest2);
    return next({ errorCode: response.UNAUTHORIZED, message: 'jwt malformed' });
  }
  return next();
};

const updateRecipe = async (req, res, _next) => {
  try {
    const recipeInfo = req.body;
    const recipeId = req.params.id;
  
    const updatedRecipe = await RecipesServices.updateRecipe(recipeId, recipeInfo);
    return res.status(response.STATUS_OK).json(updatedRecipe);
  } catch (error) {
    return error;
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const deletedRecipe = await RecipesModel.deleteRecipe(recipeId);
    if (!deletedRecipe) return res.status(response.BAD_REQUEST);
    return res.status(response.NO_CONTENT).json({});
  } catch (error) {
    return next(error);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, callback) => {
    const recipeId = req.params.id;
    callback(null, `${recipeId}.jpeg`);
  },
});

const upload = multer({ storage });

const insertImage = async (req, res, _next) => {
  try {
    console.log('entrou no try de MW.insertImage');
    console.log('req.body', req.file);
    const { id } = req.params;
    const imageUrl = `localhost:3000/src/uploads/${id}.jpeg`;
    const recipeToUpdate = await RecipesModel.insertImage(imageUrl, id);
    if (!recipeToUpdate) {
      return res.status(response.NOT_FOUND).json({ message: 'recipe not found' });
    }
    return res.status(response.STATUS_OK).json(recipeToUpdate);
  } catch (error) {
    return error;
  }
};

module.exports = {
  postRecipe,
  validateRecipe,
  checkRecipeId,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  allowEditing,
  deleteRecipe,
  upload,
  insertImage,
};

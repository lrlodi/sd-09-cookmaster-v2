const express = require('express');
const { validateToken, verifyToken } = require('../middlewares/auth');
const recipesService = require('../services/recipesService');
const { validateRecipe, validateRecipeId } = require('../middlewares/validateRecipe');

const router = express.Router();
const responseCodes = {
  success: 200,
  created: 201,
  noContent: 204,
  notFound: 404,
  notAuthorized: 401,
  unprocessableEntity: 422,
  internalServerError: 500,
};

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      verifyToken(token);
    }
    const recipes = await recipesService.getAllRecipes();
    res.status(responseCodes.success).json(recipes);  
  } catch (error) {
    res.status(401).json({ message: 'jwt malformed' });
  }
});

router.get('/:id', validateRecipeId, async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      verifyToken(token);
    }
    const { id } = req.params;
    const recipe = await recipesService.findRecipeById(id);
    res.status(responseCodes.success).json(recipe);
  } catch (error) {
    res.status(401).json({ message: 'recipe not found' });
  }
});

router.post('/', validateToken, validateRecipe, async (req, res) => {
  const reqRecipe = req.body;
  const { _id } = req.user;
  reqRecipe.userId = _id;
  const recipe = await recipesService.addRecipe(reqRecipe);
  res.status(responseCodes.created).json(recipe);
});

router.put('/:id', validateToken, async (req, res) => {
  const reqRecipe = req.body;
  const { id } = req.params;
  const reqUser = req.user;
  try {
    const changedRecipe = await recipesService.updateRecipe(reqRecipe, id, reqUser);
    res.status(responseCodes.success).json(changedRecipe);
  } catch (error) {
    res.status(responseCodes.notAuthorized).json({ message: error.message });
  }
});

router.delete('/:id', validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    await recipesService.removeRecipe(id, user);
    res.status(responseCodes.noContent).send();
  } catch (error) {
    res.status(responseCodes.notAuthorized).json({ message: error.message });
  }
});

module.exports = router;

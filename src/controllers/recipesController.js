const express = require('express');

const router = express.Router();
const recipesService = require('../services/recipesService');
const validation = require('../middlewares/validation');

const statusSucessCreate = 201;
const statusSucess = 200;

router.post('/', validation, async (req, res, next) => {
  const { name, ingredients, preparation } = req.body;
  const { userId } = req;
  const recipe = await recipesService.create({ name, preparation, ingredients, userId });

  if (recipe.error) return next(recipe);

  res
    .status(statusSucessCreate)
    .json({ recipe: { name, ingredients, preparation, userId, _id: recipe.id } });
});

router.get('/', async (_req, res, _next) => {
  const recipes = await recipesService.getAll();

  return res.status(statusSucess).json(recipes);
});

router.get('/:id', async (req, res, next) => {
  const recipe = await recipesService.getById(req.params.id);

  if (recipe.error) return next(recipe);

  return res.status(statusSucess).json(recipe);
});

module.exports = router;
const Recipes = require('../services/recipes');

const create = async (req, res, next) => {
  const { name, ingredients, preparation } = req.body;
  const { userId } = req;
  const recipe = await Recipes.create({ name, ingredients, preparation, userId });
  if (recipe.error) return next(recipe);

   res.status(201).send({ recipe });
};

const getAllRecipes = async (_req, res, _next) => {
  const alllRecipes = await Recipes.getAllRecipes();

  res.status(200).send(alllRecipes);
};

module.exports = {
  create,
  getAllRecipes,
};
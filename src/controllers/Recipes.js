const recipesService = require('../services/Recipes');

const CREATE_SUCCESS = 201;
const OK = 200;

const registerRecipe = async (req, res) => {
  try {
    const { name, ingredients, preparation } = req.body;
    const { _id } = req.user;

    const result = await recipesService.register({ name, ingredients, preparation, _id });

    res.status(CREATE_SUCCESS).json({ recipe: result });
  } catch (error) {
    const data = JSON.parse(error.message);
    res.status(data.status).send({ message: data.message });
  }
};

const getAllRecipe = async (_req, res) => {
  const result = await recipesService.getAll();
  res.status(OK).json(result);
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await recipesService.getById(id);

    res.status(OK).json(result);
  } catch (error) {
    const data = JSON.parse(error.message);
    res.status(data.status).send({ message: data.message });
  }
};

module.exports = {
  registerRecipe,
  getAllRecipe,
  getRecipeById,
};
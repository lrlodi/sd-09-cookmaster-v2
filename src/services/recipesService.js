const Joi = require('joi');
const recipesModel = require('../models/recipesModel');

const HTTP_BADREQ_STATUS = 400;
const HTTP_CREATED_STATUS = 201;

const schemaValidateRecipes = Joi.object({
  name: Joi.string()
    .required(),
  ingredients: Joi.string()
    .required(),
  preparation: Joi.string()
    .required(),
});

const create = async (name, ingredients, preparation, userId) => {
  const validateCreate = schemaValidateRecipes.validate({ name, ingredients, preparation });
  if (validateCreate.error) {
    return {
      status: HTTP_BADREQ_STATUS, err: 'Invalid entries. Try again.',
  };
}
  const recipe = await recipesModel.create(name, ingredients, preparation, userId);
  return {
    status: HTTP_CREATED_STATUS, recipe,
  };
};

module.exports = { create };
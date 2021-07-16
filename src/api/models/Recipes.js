const connection = require('./connection');

const registerRecipe = (name, ingredients, preparation, userId) => connection()
  .then((db) => db.collection('recipes').insertOne(
    { name, ingredients, preparation, userId },
    ))
  .then((result) => result.ops[0]);

const listRecipes = () => connection().then((db) => db.collection('recipes').find().toArray());

module.exports = {
  registerRecipe,
  listRecipes,
};

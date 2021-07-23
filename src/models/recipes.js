// const { ObjectId } = require('mongodb');
const connection = require('./connection');

const create = async (name, ingredients, preparation, userId) => {
  const db = await connection();
  const newRecipe = await db.collection('recipes')
    .insertOne({ name, ingredients, preparation, userId });
    // console.log(newRecipe);
    return newRecipe.ops[0];
};

module.exports = {
  create,
};

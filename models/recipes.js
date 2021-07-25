const conn = require('./connection');

const createRecipeDB = async (payload, userId) => {
  const db = await conn();
  const result = await db.collection('recipes').insertOne({ ...payload, urlImage: '', userId });
  return { recipe: result.ops[0] };
};

const getRecipesDB = async () => {
  const db = await conn();
  const result = await db.collection('recipes').find().toArray();
  return result;
};

module.exports = {
  createRecipeDB,
  getRecipesDB,
};

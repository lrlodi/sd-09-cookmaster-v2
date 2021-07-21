const { ObjectId } = require('mongodb');
const connection = require('./connection');

const recipeCreate = async (name, ingredients, preparation, userId) => {
  const recipe = await connection().then((db) =>
    db.collection('recipes')
      .insertOne({ name, ingredients, preparation, userId }));
  return recipe.ops[0];
};

const getAll = async () => {
  const recipes = await connection().then((db) =>
    db.collection('recipes')
      .find().toArray());
  return recipes;
};

const getOne = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const recipe = await connection().then((db) =>
    db.collection('recipes')
      .findOne({ _id: ObjectId(id) }));
  return recipe;
};

const recipeUpdate = async (id, name, ingredients, preparation) => {
  if (!ObjectId.isValid(id)) return null;
  const recipe = await connection().then((db) => 
    db.collection('recipes')
    .findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { name, ingredients, preparation } },
      { returnOriginal: false },
    ));
  return recipe.value;
};

const recipeDelete = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  await connection().then((db) => 
    db.collection('recipes')
      .deleteOne({ _id: ObjectId(id) }));
};

module.exports = {
  recipeCreate,
  getAll,
  getOne,
  recipeUpdate,
  recipeDelete,
};
const connection = require('./connection');

const response = (user, code) => ({ result: { user }, code });

const createUser = async (name, email, password) => {
  const result = await connection()
    .then((db) => db.collection('users').insertOne(
      { email, password, name, role: 'user' },
    ))
    .then((data) => {
      const user = { name, email, role: 'user', _id: data.insertedId };
      return response(user, 201);
    });
  return result;
};

const getUserByEmail = async (email) => {
  const result = await connection()
    .then((db) => db.collection('users').findOne({ email }))
    .then((data) => data);
  return result;
};

module.exports = { createUser, getUserByEmail };
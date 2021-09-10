const connection = require('./connection');
const genToken = require('../middlewares/JWTgen');
const response = require('../middlewares/responseCodes');

const getAllUsers = () => {
  try {
    return connection()
    .then((db) => db.collection('users').find().toArray());
  } catch (error) {
    return error;
  } 
};

const getUserByEmail = async (email) => {
  const foundUser = await connection()
    .then((db) => db.collection('users').findOne({ email }));
  return foundUser;
};

const createNewUser = async ({ name, email, password }) => {
  try {
    const registeredUsers = await getAllUsers();
      if (registeredUsers.some((user) => user.email === email)) {
          const errorObj = {
            errorCode: response.CONFLICT,
            message: 'Email already registered',
          };
        return errorObj;
      }
    return connection()
        .then((db) => db.collection('users').insertOne({ name, email, role: 'user', password }))
        .then((result) => result.ops[0]);
  } catch (error) {
    return error;
  }
};

const validateLogin = async (loginInfo) => {
  try {
    const { email } = loginInfo;
    const userExists = await getUserByEmail(email);
    if (!userExists || userExists.password !== loginInfo.password) {
      const errorObj = {
        errorCode: response.UNAUTHORIZED,
        message: 'Incorrect username or password',
      };
      return errorObj;
    }
    const userToken = genToken(userExists);
    return userToken;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createNewUser,
  getAllUsers,
  validateLogin,
  getUserByEmail,
};

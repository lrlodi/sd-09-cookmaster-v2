const joi = require('joi');
const UsersModel = require('../models/usersModel');
const response = require('../middlewares/responseCodes');

const USER_SCHEMA = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const LOGIN_SCHEMA = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const getAllUsers = async () => UsersModel.getAllUsers();

const createNewUser = (newUser) => {
  const isUserValid = USER_SCHEMA.validate(newUser);
  if (isUserValid.error) {
    const errorObj = {
      errorCode: response.BAD_REQUEST,
      message: 'Invalid entries. Try again.',
    };
    return errorObj;
  }
  return UsersModel.createNewUser(newUser);
};

const logUser = async (loginInfo) => {
  const isLoginValid = LOGIN_SCHEMA.validate(loginInfo);
  if (isLoginValid.error) {
    const errorObj = {
      errorCode: response.UNAUTHORIZED,
      message: 'All fields must be filled',
    };
    return errorObj;
  }
  const validateLogin = await UsersModel.validateLogin(loginInfo);
  return validateLogin;
};

module.exports = {
  getAllUsers,
  createNewUser,
  logUser,
};
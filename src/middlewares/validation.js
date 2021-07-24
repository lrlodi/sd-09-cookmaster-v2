const Errors = require('../errors');
const Schemas = require('../schemas');
const Auth = require('../auth');
const UserModel = require('../model/userModel');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  const { error } = Schemas.createUser.validate({ name, email, password });

  if (error) throw new Errors.InvalidUserFormError();

  next();
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const { error } = Schemas.login.validate({ email, password });

  if (error) throw new Errors.LoginFieldMissingError();

  next();
};

const createRecipe = (req, res, next) => {
  const { name, ingredients, preparation } = req.body;

  const { error } = Schemas.createRecipe.validate({ name, ingredients, preparation });

  if (error) throw new Errors.InvalidRecipeFormError();

  next();
};

const token = async (req, res, next) => {
  const reqToken = req.headers.authorization;

  if (!reqToken) next(new Errors.MissingTokenError());

  try {
    const decoded = Auth.validateToken(reqToken);
    const { password, ...user } = await UserModel.findByEmail(decoded.email);
    req.user = user;
    next();
  } catch (err) {
    console.log('Entrei');
    next(new Errors.InvalidTokenError());
  }
};

module.exports = {
  createUser,
  login,
  token,
  createRecipe,
};
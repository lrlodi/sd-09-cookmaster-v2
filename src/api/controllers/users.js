const { CREATED_STATUS, OK_STATUS } = require('../middwares/httpStatus');

const usersServices = require('../services/users');

const create = async (req, res, next) => {
  try {
    const user = req.body;

    const newUser = await usersServices.create(user);
    
    return res.status(CREATED_STATUS).json(newUser);
  } catch (err) {
  next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = req.body;

    const token = await usersServices.login(user);

    return res.status(OK_STATUS).json(token);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  login,
};
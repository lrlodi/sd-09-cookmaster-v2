const UsersServices = require('../services/usersServices');
const response = require('./responseCodes');

const getAllUsers = async (req, res) => {
  const registeredUsers = await UsersServices.getAllUsers();
  return res.status(response.STATUS_OK).json(registeredUsers);
};
const createNewUser = async (req, res, _next) => {
  const newUserInfo = req.body;
  const newUser = await UsersServices.createNewUser(newUserInfo);
  if (newUser.errorCode) return res.status(newUser.errorCode).json({ message: newUser.message });
  const { password, ...userInfo } = newUser;
  return res.status(response.STATUS_CREATED).json({ user: userInfo });
};

module.exports = {
  getAllUsers,
  createNewUser,
};

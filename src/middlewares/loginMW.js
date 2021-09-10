const UsersServices = require('../services/usersServices');
const response = require('./responseCodes');

const logUser = async (req, res) => {
  const userInfo = req.body;
  const loginSuccessful = await UsersServices.logUser(userInfo);
  if (loginSuccessful.errorCode) {
    console.log(loginSuccessful);
    return res.status(loginSuccessful.errorCode).json({ message: loginSuccessful.message });
  }
  return res.status(response.STATUS_OK).json({ token: loginSuccessful });
};

module.exports = {
  logUser,
};

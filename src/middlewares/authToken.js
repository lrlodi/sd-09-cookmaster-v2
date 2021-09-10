const jwt = require('jsonwebtoken');
const response = require('./responseCodes');

const UsersModel = require('../models/usersModel');

const mySecret = 'meusecretdetoken';
const authToken = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) return res.status(response.UNAUTHORIZED).json({ message: 'missing auth token' });
  try {
    const decodedToken = jwt.verify(token, mySecret);
    const user = await UsersModel.getUserByEmail(decodedToken.email);

    if (!user) return res.status(response.UNAUTHORIZED).json({ message: 'Usuário não encontrado' });

    req.user = user;
    return next();
  } catch (error) {
    return next({ errorCode: response.UNAUTHORIZED, message: 'jwt malformed' });
  }
};

module.exports = authToken;

const { Router } = require('express');
// const models = require('../models/Users');
const { findEmail } = require('../models/Users');
const { generateToken } = require('../services/tokenGenerate');
const { checkLoginData } = require('../middlewares');
const userSchemas = require('../schemas');

const OK = '200';
const Unauthorized = '401';

const loginController = Router();
  
loginController.post('/', checkLoginData(userSchemas), async (req, res) => {
  const { email } = req.body;
  const user = await findEmail(email);
  if (user) {
    const { _id: idToken, role } = user;
    const payload = { idToken, email, role };
    return res.status(OK).json({ token: generateToken(payload) });
  }
  res.status(Unauthorized).json({ message: 'Incorrect username or password' });
});

module.exports = loginController;
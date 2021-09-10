const jwt = require('jsonwebtoken');

const secret = 'meusecretdetoken';

const JWTgen = (userInfo) => {
  const { password, ...payload } = userInfo;
    const jwtConfig = {
      expiresIn: '7d',
      algorithm: 'HS256',
    };

    const token = jwt.sign(payload, secret, jwtConfig);
  return token;
};

module.exports = JWTgen;

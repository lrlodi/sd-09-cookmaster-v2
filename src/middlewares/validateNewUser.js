const Joi = require('joi');

const validateNewUser = (req, res, next) => {
  const pattern = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/;

  const { error } = Joi.object({
    name: Joi.string().not().empty().required(),
    email: Joi.string().regex(pattern).not().empty()
    .required(),
    password: Joi.string().not().empty().required(),
  }).validate(req.body);

  if (error) return next(error);

  next();
};

module.exports = validateNewUser;
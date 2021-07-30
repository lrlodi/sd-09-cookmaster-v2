const express = require('express');
const recipes = require('../controllers/recipes');
const validate = require('../middlewares/validators');

const route = express.Router();

route.post('/', validate.token, recipes.create);
route.get('/', recipes.getAll);
route.get('/:id', recipes.getById);
route.put('/:id', validate.token, recipes.update);
route.delete('/:id', validate.token, recipes.remove);

module.exports = route;
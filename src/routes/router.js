const express = require('express');
const UsersRouter = require('../controllers/usersController');
const LoginRouter = require('../controllers/loginController');
const RecipesRouter = require('../controllers/recipesController');
const ImagesRouter = require('../controllers/imagesController');

const router = express.Router();

router.use('/users', UsersRouter);
router.use('/login', LoginRouter);
router.use('/recipes', RecipesRouter);
router.use('/images', ImagesRouter);

module.exports = router;

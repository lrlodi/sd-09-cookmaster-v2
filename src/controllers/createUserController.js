const {
    createUserService,
    validLoginService,
    createRecipeService,
    listAllRecipesService,
    listRecipeByIdService,
    updateRecipeService,
} = require('../services/createUserService');
const { ok, created } = require('../utils/statusHttp');

const createUserController = async (req, res, next) => {
    try {
        const { name, email, password, role = 'user' } = req.body;
        const userCreated = await createUserService({ name, email, password, role });
        return res.status(created).json(userCreated);
    } catch (error) {
        return next(error);
    }
};

const createTokenController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await validLoginService(email, password);
        res.status(ok).json({ token });
    } catch (error) {
        return next(error);
    }
};

const createRecipeController = async (req, res, next) => {
    try {
        const { name, ingredients, preparation } = req.body;
        const userData = req.user;
        const recipeCreated = await createRecipeService({
            name,
            ingredients,
            preparation,
            userData,
        });
        res.status(created).json(recipeCreated);
    } catch (error) {
        return next(error);
    }
};

const listAllRecipesController = async (req, res, next) => {
    try {
        const allRecipes = await listAllRecipesService();
        res.status(ok).json(allRecipes);
    } catch (error) {
        return next(error);
    }
};

const listRecipeByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const recipe = await listRecipeByIdService(id);
        return res.status(ok).json(recipe);
    } catch (error) {
        return next(error);
    }
};

const updateRecipeController = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const { _id, role } = req.user;
        const userId = _id;
        const { ingredients, name, preparation } = req.body;
        const updatedRecipe = await updateRecipeService({
            ingredients,
            name,
            preparation,
            recipeId,
        }, userId, role);
        res.status(ok).json(updatedRecipe);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createUserController,
    createTokenController,
    createRecipeController,
    listAllRecipesController,
    listRecipeByIdController,
    updateRecipeController,
};
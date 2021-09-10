const express = require('express');
const path = require('path');

const ImagesController = express.Router();

ImagesController.get('/:id', (req, res) => {
  const recipeId = req.params.id;
  const filepath = path.join(__dirname, '..', 'uploads', recipeId);
  return res.status(200).sendFile(filepath);
});

module.exports = ImagesController;

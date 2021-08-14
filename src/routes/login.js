const express = require('express');
const controller = require('../controller/login');

const router = express.Router();

router.post('/', controller.userLogin);

module.exports = router; 
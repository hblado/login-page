const path = require('path');
const express = require('express');
const userController = require('../controller/User')
const router = express.Router()

router.get('/user/all', userController.getAll)
router.post('/user/create', userController.create)

module.exports = router
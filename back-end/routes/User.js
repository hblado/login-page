const path = require('path');
const express = require('express');
const userController = require('../controller/User');
const auth = require('../middleware/auth');
const router = express.Router()

router.get('/user/all', userController.getAll)
router.post('/user/create', userController.create)
router.post('/login', userController.login)

router.get('/', auth, userController.dashboard)

module.exports = router
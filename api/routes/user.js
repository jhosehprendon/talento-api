const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserController.user_signup)

router.post('/login', UserController.user_login)

router.get('/:email', UserController.user_get_by_email)

router.get('/user/:userId', UserController.user_get_by_userId)

router.delete('/:userId', UserController.user_delete)

module.exports = router;
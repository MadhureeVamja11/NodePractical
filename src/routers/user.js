const express = require('express');
const auth = require('./../middlewares/auth')
const router = express.Router();

const UserController = require('./../controllers/users.controller');
const controller = new UserController();

router.post('/signup', (req, res) => controller.signup(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', auth ,(req, res) => controller.logout(req, res));


module.exports = router;
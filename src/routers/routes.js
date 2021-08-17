const express = require('express');
const router = express.Router();

const user = require('./../routers/user')
const category = require('./../routers/category')
router.use('/auth', user);
router.use('/category', category);
module.exports = router
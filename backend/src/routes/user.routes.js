const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(protect, admin, getUsers);

module.exports = router;

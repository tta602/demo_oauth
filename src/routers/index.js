'use strict';

const express = require('express');
const AppRouterName = require('./router.name');
const router = express.Router();

router.use(AppRouterName.user, require('./user'));
router.use(AppRouterName.oauth, require('./oauth'));

module.exports = router;

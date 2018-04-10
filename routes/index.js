var express = require('express');
var router = express.Router();

require('./user').mountTo(router)
require('./invoice').mountTo(router)

module.exports = router;

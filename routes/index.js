var express = require('express');
var router = express.Router();

require('./users.js').mountTo(router);
require('./credential.js').mountTo(router);
require('./company.js').mountTo(router);
require('./client.js').mountTo(router);
require('./invoice.js').mountTo(router);

module.exports = router;

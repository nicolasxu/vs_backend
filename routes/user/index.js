var register = require('./register.js')

var createToken = require('./createToken.js')

module.exports = {mountTo: mountRoutes};

function mountRoutes (router) {

  router.post('/user', register)

  router.post('/user/token', createToken )
}
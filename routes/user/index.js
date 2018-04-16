const register = require('./register.js')

const createToken = require('./createToken.js')

const verifyEmail = require('./verifyEmail.js')

module.exports = {mountTo: mountRoutes};

function mountRoutes (router) {

  router.post('/api/user', register)

  router.post('/api/user/token', createToken)

  router.post('/api/user/verifyemail', verifyEmail)
}
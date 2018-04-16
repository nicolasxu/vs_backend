const register = require('./register.js')
const createToken = require('./createToken.js')
const verifyEmail = require('./verifyEmail.js')
const resetPwdLink = require('./resetPwdLink.js')
const resetPwd = require('./resetPwd.js')

module.exports = {mountTo: mountRoutes};

function mountRoutes (router) {

  router.post('/api/user', register)

  router.post('/api/user/token', createToken)

  router.post('/api/user/verifyemail', verifyEmail)

  router.post('/api/user/resetpwdlink', resetPwdLink)

  router.post('/api/user/resetpwd', resetPwd)
}
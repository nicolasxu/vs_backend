var register = require('./register.js')
var checkLogin = require('./checkLogin.js')
var getUserDetail = require('./getUserDetail.js')

module.exports = {mountTo: mountRoutes};

function mountRoutes (router) {
  router.post('/user', register)
  router.get('/user', checkLogin, getUserDetail)

}
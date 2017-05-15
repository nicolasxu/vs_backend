var login = require('./login.js')
var checkLogin = require('./checkLogin.js')
var getUserDetail = require('./getUserDetail.js')



module.exports = {mountTo: mountRoutes};

function mountRoutes (router) {

  router.post('/user', login)

  router.get('/user', checkLogin, getUserDetail)
}
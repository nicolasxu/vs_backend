// company index
var createCompany = require('./createCompany.js')
var updateCompany = require('./updateCompany.js')
var getCompany = require('./getCompany.js')
var checkLogin = require('../user/checkLogin.js')

module.exports = {mountTo: mountRoutes}

function mountRoutes(router) {

  router.post('/company', checkLogin, createCompany)
  router.put('/company', checkLogin, updateCompany)
  router.get('/company', checkLogin, getCompany)

}
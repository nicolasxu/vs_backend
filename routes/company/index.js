// company index
var createCompany = require('./createCompany.js')
var updateCompany = require('./updateCompany.js')
var getCompany = require('./getCompany.js')
var checkLogin = require('../user/checkLogin.js')
var searchCompany = require('./searchCompany.js')

var getClients = require('./getClients.js')
var createClient = require('./createClient.js')
var updateClient = require('./updateClient.js')
var deleteClient = require('./deleteClient.js')

var getVendors = require('./getVendors.js')
var addVendor = require('./addVendor.js')
var deleteClient = require('./deleteClient.js')

module.exports = {mountTo: mountRoutes}

function mountRoutes(router) {

  router.post('/company', checkLogin, createCompany)
  router.put('/company', checkLogin, updateCompany)
  router.get('/company', checkLogin, getCompany)
  
  router.get('/company/active', checkLogin, searchCompany)

  router.get('/company/client', checkLogin, getClients)
  router.post('/company/client', checkLogin, createClient)
  router.put('/company/client', checkLogin, updateClient)
  router.delete('/company/client', checkLogin, deleteClient)

  router.get('/company/vendor', checkLogin, getVendors)
  router.post('/company/vendor', checkLogin, addVendor)
  router.delete('/company/vendor', checkLogin, deleteClient)


}
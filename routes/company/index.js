// company index
var createCompany = require('./createCompany.js')
var updateCompany = require('./updateCompany.js')
var getCompany = require('./getCompany.js')
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

  router.post('/company' , createCompany)
  router.put('/company' , updateCompany)
  router.get('/company' , getCompany)
  
  router.get('/company/active' , searchCompany)

  router.get('/company/client' , getClients)
  router.post('/company/client' , createClient)
  router.put('/company/client' , updateClient)
  router.delete('/company/client' , deleteClient)

  router.get('/company/vendor' , getVendors)
  router.post('/company/vendor' , addVendor)
  router.delete('/company/vendor', deleteClient)


}
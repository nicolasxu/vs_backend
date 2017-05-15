// credential index
var createCredential = require('./createCredential.js') // login
var deleteCredential = require('./deleteCredential.js') // logout
var getCredential = require('./getCredential.js')       // check if login

module.exports = { mountTo: mountRoutes}

function mountRoutes(router) {
  router.post('/credential', createCredential)
  router.delete('/credential', deleteCredential)
  router.get('/credential', getCredential)
}
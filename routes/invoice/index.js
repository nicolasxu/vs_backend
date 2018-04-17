
const invoicePdf = require('./invoicePdf.js')
const store = require('../../utils/store.js')
const verifyToken = require('../../utils/verifyToken.js')

module.exports = {
  mountTo: mountRoutes
}


function mountRoutes(router) {
  router.post('/api/invoicepdf/:viewid', invoicePdf)
}
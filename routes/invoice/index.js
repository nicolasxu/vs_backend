
const invoicePdf = require('./invoicePdf.js')
const store = require('../../utils/store.js')
const verifyToken = require('../../utils/verifyToken.js')
const getInvoiceByViewId = require('./getInvoiceByViewId.js')
const payAndRegister = require('./payAndRegister.js')

module.exports = {
  mountTo: mountRoutes
}


function mountRoutes(router) {
  router.get('/api/invoicepdf/:viewid', invoicePdf)
  router.get('/api/invoice/:viewid', getInvoiceByViewId)
  router.post('/pai/invoice/payAndRegister', payAndRegister)
}
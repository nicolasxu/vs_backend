const Company = require('../models').Company
const User = require('../models').User

module.exports = replaceInvoiceToCompany

async function replaceInvoiceToCompany(email, companyId) {

  // 1. find private company with this email
  // 2.  find all invoice with this private company ids
  // 3. replace all there ids with companyId from param

}
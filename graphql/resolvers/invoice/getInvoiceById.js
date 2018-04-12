// const Request = require('../../../models').Request
// const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
const Company = require('../../../models').Company
const Invoice = require('../../../models').Invoice


module.exports = getInvoiceById


async function getInvoiceById(obj, args, context, info) {

  // when reach this point, user is already gurenteed login
  let userId = store.getUserId()

  // 1. company exist
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4000,
      err_msg: 'User company does not exist'
    }
  }

  // 2. invoice id valid
  let invoiceId = args.id
  let isValid = mongoose.Types.ObjectId.isValid(invoiceId)
  if (!isValid) {
    return {
      err_code: 4001,
      err_msg: 'invoiceId is not valid'
    }
  }

  let searchObj = {}
  let type = args.type? args.type: 'sent' // 'sent' or 'received'
  
  if (type === 'sent') {
    searchObj['fromCompany.companyId'] = myCompany._id
  } else {
    searchObj['toCompany.companyId'] = myCompany._id
  } 
  searchObj._id = invoiceId  

  // 3. get invoice
  let invoice = await Invoice.findOne(searchObj)

  return invoice
  
}
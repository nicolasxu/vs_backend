// const Request = require('../../../models').Request
// const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
const Company = require('../../../models').Company
const Invoice = require('../../../models').Invoice

module.exports = getInvoiceList


async function getInvoiceList(obj, args, context, info) {

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
  let searchObj = {}
  let type = args.type? args.type: 'sent' // 'sent' or 'received'
  
  if (type === 'sent') {
    searchObj['fromCompany.companyId'] = myCompany._id
  } else {
    searchObj['toCompany.companyId'] = myCompany._id
  }

  // offset: Int, limit: Int
  let offset = parseInt(args.offset) || 0 
  let limit = parseInt(args.limit) || 50

  return Invoice.paginate(
    searchObj, 
    {offset: offset, limit: limit, lean: true}
  )
}
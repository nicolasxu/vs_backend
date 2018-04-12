// const Request = require('../../../models').Request
// const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
// let { GraphQLError } = require('graphql')
// const Company = require('../../../models').Company
// const Product = require('../../../models').Product

module.exports = voidInvoice


async function voidInvoice(obj, args, context, info) {

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


  // 3. invoice exist

  let invoice = await Invoice.findOne({_id: invoiceId, 'fromCompany.companyId': myCompany._id})
  if (!invoice) {
    return {
      err_code: 4002,
      err_msg: 'Can not find invoice in your sent invoice list'
    }
  }

  let updated = await Invoice.findOneAndUpdate(
      {_id: invoiceId, 'fromCompany.companyId': myCompany._id},
      {status: 'voided'},
      {upsert: false, new: true}
    )
    
  return updated    

}


















const Company = require('../../../models').Company
let store = require('../../../utils/store.js')

module.exports = searchClients

async function searchClients(obj, args, context, info) {

  // userId is guaranteed to exist here
  let userId = store.getUserId()

  // 1. my company exists
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4000,
      err_msg: 'User does not have a company'
    }    
  }



}
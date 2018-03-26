const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')

module.exports = myClients

async function myClients(obj, args, context, info) {

  // 1. check user id 
  let userId = store.getUserId()
  if (!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is empty or not valid'
    }
  }

  // 2. get my company
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4001,
      err_msg: 'Can not find user company'
    }
  }  

  let offset = parseInt(args.offset) || 0 
  let limit = parseInt(args.limit) || 50
  return Company.getClients(myCompany._id, offset, limit)
}
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
  let offset = parseInt(args.offset) || 0 
  let limit = parseInt(args.limit) || 50
  return Company.getClients(userId, offset, limit)
}
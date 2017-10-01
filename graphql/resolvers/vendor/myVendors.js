const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')

module.exports = myVendors

async function myVendors(obj, args, context, info) {

  // 1. check user id 
  let userId = store.getUserId()
  if (!userId) {
    return new GraphQLError('No user id found in store')    
  }

  let offset = parseInt(args.offset) || 0 
  let limit = parseInt(args.limit) || 50
  return Company.getVendors(userId, offset, limit)

}
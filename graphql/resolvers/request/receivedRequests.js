const Request = require('../../../models').Request
const User = require('../../../models').User
const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company

module.exports = receivedRequest

async function receivedRequest(obj, args, context, info) {

  let offset = args.offset || 0
  let limit = args.limit || 50

  let userId = store.getUserId()

  if (!userId) {
    return new GraphQLError('User does not have token')
  }

  let myCompany = await Company.findUserCompany(userId)
  if(!myCompany) {
    return new GraphQLError('User does not have a company')
  }

  return Request.receivedRequestList(myCompany._id, offset, limit)



}
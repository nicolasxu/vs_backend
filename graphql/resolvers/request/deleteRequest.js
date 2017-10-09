const Request = require('../../../models').Request
const User = require('../../../models').User
const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company


module.exports = deleteRequest

async function deleteRequest(obj, args, context, info) {
  
  let userId = store.getUserId()

  if (!userId) {
    return new GraphQLError('User does not have token')
  }

  let requestId = args.requestId
  if (!requestId) {
    return new GraphQLError('Request ID does not exist')
  }

  // 1. verify user is in "to company"
  let userCompanny = await Company.findUserCompany(userId)
  if (!userCompanny) {
    return new GraphQLError('User does not have a company')
  }

  let fromCompanyId = userCompanny._id

  return Request.deleteRequest(requestId, fromCompanyId )

}
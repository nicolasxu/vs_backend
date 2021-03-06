const Request = require('../../../models').Request
const User = require('../../../models').User
const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company

module.exports = rejectRequest

async function rejectRequest(obj, args, context, info) {
  
  let userId = store.getUserId()

  if (!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not valid or empty'
    }
  }

  let requestId = args.requestId
  if (!requestId) {
    return {
      err_code: 4001,
      err_msg: 'Request id is empty'
    }
  }

  // 1. verify user is in "to company"
  let userCompanny = await Company.findUserCompany(userId)
  if (!userCompanny) {
    return {
      err_code: 4002,
      err_msg: 'User does not have company'
    }
  }

  let toCompanyId = userCompanny._id

  let updatedRequest = await Request.rejectRequest(requestId, toCompanyId)
  if (!updatedRequest) {
    return {
      err_code: 4003,
      err_msg: 'Can not find request to update'
    }
  }

  return updatedRequest

}
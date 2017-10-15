const Request = require('../../../models').Request
const User = require('../../../models').User
const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company


module.exports = deleteRequest

async function deleteRequest(obj, args, context, info) {
  
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

  // 1. get user company
  let userCompanny = await Company.findUserCompany(userId)
  if (!userCompanny) {
    return {
      err_code: 4002,
      err_msg: 'User does not have a company'
    }

  }

  let fromCompanyId = userCompanny._id

  // only allow sender to delete request. It is like a withdraw
  return Request.deleteRequest(requestId, fromCompanyId)

}
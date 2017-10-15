const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')


module.exports = getMyClientDetail

async function getMyClientDetail(obj, args, context, info) {

  let userId = store.getUserId()

  if(!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not found or not valid'
    }
  }

  let clientId = args.id

  if (!clientId) {
    return {
      err_code: 4001,
      err_msg: 'Client id is empty'
    }
  }

  let clientDetail = await Company.getMyClientDetail(userId, clientId)

  if (!clientDetail) {
    return {
      err_code: 4002,
      err_msg: 'Can not find your client'
    }
  }
  return clientDetail
}
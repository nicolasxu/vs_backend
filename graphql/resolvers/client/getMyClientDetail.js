const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')


module.exports = getMyClientDetail

async function getMyClientDetail(obj, args, context, info) {

  let userId = store.getUserId()

  if(!userId) {
    return new GraphQLError('No user id found in store')
  }

  let clientId = args.id

  if (!clientId) {
    return new GraphQLError('Client id is empty')
  }

  let clientDetail = await Company.getMyClientDetail(userId, clientId)

  if (!clientDetail) {
    return new GraphQLError('Can not find your client')
  }

  return clientDetail


}
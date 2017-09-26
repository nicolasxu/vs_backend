const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let {GraphQLError} = require('graphql')
module.exports = createMyCompany


async function createMyCompany(obj, args, context, info) {

  let userId = store.user && store.user._id

  if (!userId) {
    return new GraphQLError('User does not have token')
  }

  let company = args.input
  company.members = [userId]

  let result = await Company.createMyCompany(company)

  if (result === 'COMPANY EXIST') {
    return new GraphQLError('User has already created a company')
  } else {
    return result
  }
}
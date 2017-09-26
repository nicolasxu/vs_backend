const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')


module.exports = createMyClient


async function createMyClient(obj, args, context, info) {
  
  let userId = store.getUserId()

  if(!userId) {
    return new GraphQLError('No user id found in store')
  }

  let client = args.input

  let myCompany = await Company.findOne({members: {'$in': [userId]}})

  if (!myCompany) {
    return new GraphQLError('User does not have a company')
  }

  let myCompanyId = myCompany._id

  delete client._id // just in case

  client.public = false
  client.creatorCompanyId = myCompanyId

  try {
    let clientCreated = await Company.create(client)
  } catch (e) {
    return new GraphQLError('Client object may contain unsupported field(s)')
  }

  await Company.findOneAndUpdate({_id: myCompanyId._id}, {$push: {clients: clientCreated._id}}, {upsert: false, new: true} )

  return clientCreated
}
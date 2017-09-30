const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const _ = require('lodash')

module.exports = updateMyClient


async function updateMyClient(obj, args, context, info) {

  // 1. check if user login by checking store user id exist
  let userId = store.getUserId()

  if(!userId) {
    return new GraphQLError('No user id found in store')
  }

  let newClient = args.input
  // 2. check if client id exist in input
  let clientId = args.id
  if(!clientId) {
    return new GraphQLError('client id is not not present in input')
  }  

  // 2. find user company by user id

  // 3. check if client id is in user company clients array
  let myCompany = await Company.findOne({
    members: {'$in': [userId]}, 
    clients: {'$in': [clientId]}
  })
  if (!myCompany) {
    return new GraphQLError('client is not in your client array, or your company do not exist')
  }  

  // 4. find client company by client id
  let oldClient = await Company.findOne({_id: clientId}) 
  if (!oldClient) {
    return new GraphQLError('client company document does not exist')
  }
  
  // 4. check if it private or public company
  if (oldClient.public === false && oldClient.creatorCompanyId.toString() === myCompany.id) {
    // 5. if private, update client company document in company collection        
    // do update
    let newClientCopy = _.cloneDeep(newClient)
    delete newClientCopy._id
    let updatedClient = await Company.findOneAndUpdate({_id: clientId}, newClientCopy,  {upsert: false, new: true})
    return updatedClient
  } else {
    // 6. if public, return error
    return new GraphQLError('Can not update client that does not belong to you')
  }
}
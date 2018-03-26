const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const _ = require('lodash')

module.exports = updateMyClient


async function updateMyClient(obj, args, context, info) {

  // 1. check if user login by checking store user id exist
  let userId = store.getUserId()

  if(!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not valid or empty'
    }
  }

  let newClient = args.input
  // 2. check if client id exist in input
  let clientId = args.id
  if(!clientId) {
    return {
      err_code: 4001,
      err_msg: 'Client id is empty'
    }
  }  

  // 2. find user company by user id

  // 3. check if client id is in user company clients array
  let myCompany = await Company.findOne({
    members: {'$in': [userId]}, 
    clients: {'$in': [clientId]}
  })
  if (!myCompany) {
    return {
      err_code: 4002,
      err_msg: 'client is not in your client array, or your company do not exist'
    }
  }  

  // 4. find client company by client id
  let oldClient = await Company.findOne({_id: clientId}).lean()
  if (!oldClient) {
    return {
      err_code: 4003,
      err_msg: 'client company document does not exist'
    }

  }
  
  // 4. check if it private or public company
  if ( oldClient.creatorCompanyId === myCompany.id) {
    // 5. if private, update client company document in company collection        
    // do update
    let newClientCopy = _.cloneDeep(newClient)
    delete newClientCopy._id
    return Company.findOneAndUpdate({_id: clientId}, newClientCopy,  {upsert: false, new: true})
  } else {
    // 6. if public, return error
    return {
      err_code: 4004,
      err_msg: 'Can not update client that does not belong to you'
    }
  }
}
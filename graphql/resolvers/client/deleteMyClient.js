const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')

module.exports = deleteMyClient


async function deleteMyClient(obj, args, context, info) {

  // 1. check if user login by checking store user id
  const userId = store.getUserId()
  // 2. find user company id
  if(!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not found'
    }

  }


  // 3. check if client id is passed in
  const clientId = args.id
  if(!clientId) {
    return {
      err_code: 4001,
      err_msg: 'Client id is not found'
    }

  }

  // 4. check if client id in company's clients array, 
  //   if so, remove id from my company clients array,
  //   if not, return error, stop executing the code after this. 
  let myCompany = await Company.findOne({
    members: {'$in': [userId]}, 
    clients: {'$in': [clientId]}
  })

  if (!myCompany) {
    return new GraphQLError('client is not in your client array')
  }

  let delResult = await Company.findOneAndUpdate({
    members: {'$in': [userId]}, 
    clients: {'$in': [clientId]}
  }, { $pullAll: {clients: [clientId]} }, {upsert: false, new: true})

  // 5. delete company document by client id if it is private company.
  //    If not private company, do nothing

  let foundClient = await Company.findOne({_id: clientId}).lean()
  if (!foundClient) {
    return {
      err_code: '4002',
      err_msg: 'Orphan client id deleted'
    }

  }

                                                /* this is company id object, must conver to string to compare */
  if (foundClient.public === false && foundClient.creatorCompanyId === myCompany.id) {
    // private client
    let deleteResult = await Company.deleteOne({_id: clientId})
    
  }

  // 6. return this type:
  return  {
    _id: clientId,
    count: 1,
    message: 'Client deleted'
  }
}





/* 

mutation myDelete($id: String) {
  deleteMyClient(id: $id) {
    _id
    count
    message
  }
}

{
  "id": "59cfcab4b0abd5455cce1b13"
}





*/
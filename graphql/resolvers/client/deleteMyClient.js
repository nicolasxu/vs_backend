const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')

module.exports = deleteMyClient

// only for deleting privat client, if live client, return error
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

  // 2. get my company
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4002,
      err_msg: 'Can not find user company'
    }
  }

  // 3. is my client
  let isMyClient = false
  let clients = myCompany.clients
  for(let i = 0; i < clients.length; i++) {
    if (clients[i].toString() === clientId) {
      isMyClient = true
      break
    }
  }
  if (!isMyClient) {
    return {
      err_code: 4003,
      err_msg: 'Company with this clientId is not your client'
    }
  }

  // 4. company record exists
  let thisClient = await Company.findOne({_id: clientId})
  if (!thisClient) {
    return {
      err_code: 4004,
      err_msg: 'Can not find Company record by this clientId'
    }
  }

  // 5. is my private company
  let isCreatedByMyCompany = thisClient.creatorCompanyId.toString() === myCompany._id.toString()
  if (!isCreatedByMyCompany) {
    return {
      err_code: 4005,
      err_msg: 'Client is not your private record'
    }
  }

  // 6. delete this company by clientId
  let deleteRes = await Company.deleteOne({_id: clientId})
  console.log('deleteOne Res', deleteRes) // it should be an query object

  // 7. update my company record
  let i = myCompany.clients.length

  while(i--) {
    if (myCompany.clients[i].toString() === clientId) {
      myCompany.clients.splice(i, 1)
    }
  }
  await myCompany.save()

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
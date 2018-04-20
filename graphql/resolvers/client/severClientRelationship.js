const Company = require('../../../models').Company
let store = require('../../../utils/store.js')


module.exports = severClientRelationship


async function severClientRelationship(obj, args, context, info) {

  
  const userId = store.getUserId()

  // 1. client id exists
  let clientId = args.id
  if (!clientId) {
    return {
      err_code: 4000, 
      err_msg: 'ClientId is empty'
    }
  }

  // 2. get my company
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4001,
      err_msg: 'Can not find user company'
    }
  }

  // 3. is my in clients
  let clients = myCompany.clients
  let clientIndex = -1
  let isMyClient = false
  for(let i = 0; i < clients.length; i++) {
    if (clients[i].toString() === clientId) {
      isMyClient = true
      clientIndex = i
      break
    }
  }
  if (!isMyClient) {
    return {
      err_code: 4002,
      err_msg: 'company with this clientId is not in your clients'
    }
  }

  // 4. not private
  let thisClient = await Company.findOne({_id: clientId})
  if (!thisClient) {
    return {
      err_code: 4003,
      err_msg: 'Can not find company record by clientId'
    }
  }

  if (thisClient.creatorCompanyId) {
    return {
      err_code: 4004,
      err_msg: 'Client is not a live company'
    }
  }

  // 5. update my company
  myCompany.clients.splice(clientIndex, 1)
  await myCompany.save()

  // 6. update vendors in client company
  let vendors = thisClient.vendors
  let i = vendors.length
  let myCompanyId = myCompany._id.toString()
  while(i--) {
    if (vendors[i].toString () === myCompanyId) {
      vendors.splice(i, 1)
      break
    }
  }
  await thisClient.save()

  return myCompany

}







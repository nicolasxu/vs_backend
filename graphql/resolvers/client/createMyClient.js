const Company = require('../../../models').Company
const User = require('../../../models').User
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')


module.exports = createMyClient


async function createMyClient(obj, args, context, info) {

  // 1. user login
  let userId = store.getUserId()

  // 2. my company exists
  // myCompany is a model instance
  let myCompany = await Company.findUserCompany(userId)

  if (!myCompany) {
    return {
      err_code: 4001,
      err_msg: 'User does not have a company'
    }
  }

  //3. only take one email, the rest is discarded...
  let clientEmail = args.input.invoiceEmails && args.input.invoiceEmails[0]
  if (!clientEmail) {
    return {
      err_code: 4002,
      err_msg: 'Private client email is empty'
    }
  }

  let clientName = args.input.name
  if (!clientName) {
    return {
      err_code: 4003,
      err_msg: 'Client company name is empty'
    }
  }

  // 4. make sure client email does not belong to any active company
  let isRegistered = await User.isRegistered(clientEmail)
  if (isRegistered) {
    return {
      err_code: 4004,
      err_msg: 'email belongs to registered user, can not create private with this email.'
    }
  }

  // 5. make sure this email is not in my private client emails
  let isUsed = await myCompany.isEmailInPrivateClients(clientEmail)
  if (isUsed) {
    return {
      err_code: 4005,
      err_msg: 'Email used by other private client'
    }
  }

  let myCompanyId = myCompany._id
  let client = args.input
  delete client._id // create new private client does not need id

  // must set these 2 fields
  client.creatorCompanyId = myCompanyId
  client.vendors = []
  client.vendors.push(myCompanyId)

  // creawte comapny record
  let clientCreated
  try {
    clientCreated = await Company.create(client)
  } catch (e) {
    return {
      err_code: 4006,
      err_msg: 'client object may contain unsupported fields'
    }

  }

  // link put created company id to clients array

  await Company.findOneAndUpdate({_id: myCompany._id}, {$push: {clients: clientCreated._id}}, {upsert: false, new: true} )
  
  return clientCreated

}

/* 



mutation myMutation ($input: CompanyInput) {
  createMyClient(input: $input) {
    _id
    name
    invoiceEmails
  }
}


{
  "input": {
    "name": "client 1",
    "invoiceEmails": ["nick@nick.com"]
  }
}






*/
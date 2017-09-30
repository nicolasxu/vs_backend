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

  /*** future todo: check user privilege ***/

  let myCompany = await Company.findOne({members: {'$in': [userId]}})

  if (!myCompany) {
    return new GraphQLError('User does not have a company')
  }

  let myCompanyId = myCompany._id

  delete client._id // create new private client does not need id

  // must set these 2 fields
  client.public = false
  client.creatorCompanyId = myCompanyId

  // creawte comapny record
  let clientCreated
  try {
    clientCreated = await Company.create(client)
  } catch (e) {
    return new GraphQLError('Client object may contain unsupported field(s)')
  }

  // link put created company id to clients array

  let updatedMyCompany = await Company.findOneAndUpdate({_id: myCompany._id}, {$push: {clients: clientCreated._id}}, {upsert: false, new: true} )
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
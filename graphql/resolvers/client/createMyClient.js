const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')


module.exports = createMyClient


async function createMyClient(obj, args, context, info) {

  let userId = store.getUserId()

  if(!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not found'
    }
  }

  let client = args.input

  /*** future todo: check user privilege ***/

  let myCompany = await Company.findOne({members: {'$in': [userId]}})

  if (!myCompany) {
    return {
      err_code: 4001,
      err_msg: 'User does not have a company'
    }
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
    return {
      err_code: '4002',
      err_msg: 'client object may contain unsupported fields'
    }

  }

  // link put created company id to clients array

  return Company.findOneAndUpdate({_id: myCompany._id}, {$push: {clients: clientCreated._id}}, {upsert: false, new: true} )

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
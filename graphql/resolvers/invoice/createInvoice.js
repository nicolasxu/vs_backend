// const Request = require('../../../models').Request
// const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
// let { GraphQLError } = require('graphql')
// const Company = require('../../../models').Company
// const Product = require('../../../models').Product

module.exports = createInvoice


async function createInvoice(obj, args, context, info) {

  // when reach this point, user is already gurenteed login
  let userId = store.getUserId()

  // 1. fromCompany.cid is valid
  // 2. toCompany.cid is valid
  // 3. templateId is valid

  // 4. make sure dueDate is >= invoice date

  // 5. fromCompany exists & get fromCompany

  // 6. toCompany is my client, & get toCompany

  // 7. generate invoice number

  // 8. fill invoice status, payment status

  // 9. generate viewId

  // 10. create mongoDB record

  // todo: 
  /* 

    - send alert email
    - send Websocket message

  */

  // 11. return data

  
}
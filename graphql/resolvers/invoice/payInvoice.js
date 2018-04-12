// const Request = require('../../../models').Request
// const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
// let { GraphQLError } = require('graphql')
// const Company = require('../../../models').Company
// const Product = require('../../../models').Product

module.exports = payInvoice


async function payInvoice(obj, args, context, info) {

  // when reach this point, user is already gurenteed login
  let userId = store.getUserId()

  // todo...
  
}
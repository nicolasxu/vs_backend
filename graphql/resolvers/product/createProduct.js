const Request = require('../../../models').Request
const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company
const Product = require('../../../models').Product

module.exports = createProduct


async function createProduct(obj, args, context, info) {


  // 1. user login
  let userId = store.getUserId()
  if (!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not valid or empty'
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

  let productInput = args.input // 'input' is specified in mutation type
  if (!productInput) {
    return {
      err_code: 4002,
      err_msg: 'input variable is empty'
    }
  }

  if ((productInput.price === void 0) || !productInput.description) {
    return {
      err_code: 4003,
      err_msg: 'price or description is empty'
    }
  }
  productInput.companyId = myCompany._id


  let createdProduct = await Product.create(args.input)

  return createdProduct

}
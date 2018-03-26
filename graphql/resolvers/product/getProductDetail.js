const Request = require('../../../models').Request
const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company
const Product = require('../../../models').Product

module.exports = getProductDetail


async function getProductDetail(obj, args, context, info) {
  

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

  // 3. product id
  let productId = args.id
  if (!productId) {
    return {
      err_code: 4002,
      err_msg: 'Product id is empty'
    }
  }

  // 3. id valid
  let isValid = mongoose.Types.ObjectId.isValid(productId)
  if (!isValid) {
    return {
      err_code: 4003,
      err_msg: 'Product id is not valid'
    }
  }

  return Product.findOne({_id: productId, companyId: myCompany._id})




}
const Request = require('../../../models').Request
const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company
const Product = require('../../../models').Product

module.exports = getProducts


async function getProducts(obj, args, context, info) {
  


  // 1. check user login 
  let userId = store.getUserId()

/*
  // *** debug ***

  let res = await Company.searchClients(userId, 'nick88')
  console.log('search res', res)

  // *** debug ***
*/

  // 2. get my company
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4001,
      err_msg: 'Can not find user company'
    }
  }


  let offset = parseInt(args.offset) || 0 
  let limit = parseInt(args.limit) || 50

  return Product.paginate({companyId: myCompany._id }, {offset: offset, limit: limit, lean: true})

}
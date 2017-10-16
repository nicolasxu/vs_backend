const Request = require('../../../models').Request
const User = require('../../../models').User
const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company


module.exports = createRequest

// can be used to create client request, or vendor request
async function createRequest(obj, args, context, info) {

  let userId = store.getUserId()

  if(!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token does not exist'
    }

  }

  let toEmail = args.toEmail
  let toIs = args.toIs // 'client', 'vendor'

  if (!toEmail || !toIs) {
    return {
      err_code: 4003,
      err_msg: 'toEmail or toIs is empty'
    }

  }

  // from company is always user's company

  // 1. find fromCompany
  let myCompany = await Company.findUserCompany(userId) // return lean json object, not document
  if (!myCompany) {
    return {
      err_code: 4004,
      err_msg: 'User company does not exist'
    }

  }
  // 2. find toCompany
        // find user id by email first
  let toUser = await User.findActiveUserByEmail(toEmail)
  if (!toUser) {

    return {
        err_code: 4001, 
        err_msg: 'No user found by this email'
    }
  }

  let toUserId = toUser._id
  let toCompany = await Company.findUserCompany(toUserId)

  if (!toCompany) {
    return {
      err_code: 4008,
      err_msg: 'To company is not found by toEmail'
    }

  }

  if (toCompany._id.toString() === myCompany._id.toString()) {
    return {
      err_code: 4005,
      err_msg: 'Can not send request to your own company'
    }
  }

  // check if already established relationship

  if (toIs.toLowerCase() === 'client') {
    // check clients
    let clientDetail = await Company.getMyClientDetail(userId, toCompany._id)
    if (clientDetail) {
      return {
        err_code: 4006,
        err_msg: 'To Company is already your client'
      }

    } 
  } else {
    // check vendors
    let vendorDetail = await Company.getMyVendorDetail(userId, toCompany._id)
    if (vendorDetail) {
      return {
        err_code: 4007,
        err_msg: 'To Company is already your vendor'
      }

    }
  }

  // 3. set clientCid
  // 4. set vendorCid
  let clientCid
  let vendorCid
  if (toIs.toLowerCase() === 'client') {
    clientCid = toCompany._id
    vendorCid = myCompany._id
  } else {
    // vendor
    clientCid = myCompany._id
    vendorCid = toCompany._id
  }
  
  // 5. find userfullname

  let userFullname = store.getUserFullname()

  return Request.createRequest(myCompany, toCompany, clientCid, vendorCid, userFullname)
}
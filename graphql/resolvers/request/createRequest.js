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
    return new GraphQLError('User does not have token')
  }

  let toEmail = args.toEmail
  let toIs = args.toIs // 'client', 'vendor'

  if (!toEmail || !toIs) {
    return new GraphQLError('toEmail or toIs does not exist')
  }

  // from company is always user's company

  // 1. find fromCompany
  let myCompany = await Company.findUserCompany(userId) // return lean json object, not document
  if (!myCompany) {
    return new GraphQLError('user company does not exist')
  }
  // 2. find toCompany
        // find user id by email first
  let toUser = await User.findActiveUserByEmail(toEmail)
  if (!toUser) {
    // return new GraphQLError('No user found by this email')
    return {
        err_code: '4001', 
        err_msg: 'No user found by this email'
    }
  }

  let toUserId = toUser._id
  let toCompany = await Company.findUserCompany(toUserId)

  if (!toCompany) {
    return new GraphQLError('User with this email does not have a company')
  }

  // check if already established relationship

  if (toIs.toLowerCase() === 'client') {
    // check clients
    let clientDetail = await Company.getMyClientDetail(userId, toCompany._id)
    if (clientDetail) {
      return new GraphQLError('It is already your client')
    } 
  } else {
    // check vendors
    let vendorDetail = await Company.getMyVendorDetail(userId, toCompany._id)
    if (vendorDetail) {
      return new GraphQLError('It is already your vendor')
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
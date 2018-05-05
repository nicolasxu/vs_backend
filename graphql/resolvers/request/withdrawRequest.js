const Request = require('../../../models').Request
const User = require('../../../models').User
const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company
const mongoose = require('mongoose')

module.exports = withdraw

async function withdraw(obj, args, context, info) {

  let userId = store.getUserId()

  // 1. requestId exists
  let requestId = args.requestId
  if (!requestId) {
    return {
      err_code: 4001,
      err_msg: 'Request id is empty'
    }
  }

  // 2. requestId is valid ObjectId
  let isIdValid = mongoose.Types.ObjectId.isValid(requestId)
  if (!isIdValid) {
    return {
      err_code: 4002,
      err_msg: 'RequestId id is not valid'
    }
  }  

  // 3. user company exists
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4003,
      err_msg: 'User does not have company'
    }
  }

  // 4. get the request
  let theRequest = await Request.findOne({_id: requestId}) // return Query object
  if(!theRequest) {
    return {
      err_code: 4004,
      err_msg: 'Request by this id does not exist'
    }
  }

  // 5. my company is the sender 
  if (theRequest.from_company_id.toString() !== myCompany._id.toString()) {
    return {
      err_code: 4005,
      err_msg: 'Can not withdraw request whose sender is not your company'
    }
  }

  // 6. request status must be 'pending'
  if (theRequest.status !== 'pending') {
    return {
      err_code: 4006,
      err_msg: 'Request status is not pending'
    }
  }

  // 6. update
  let updatedRequest = await Request.findOneAndUpdate({_id: requestId}, {status: 'withdrawn'}, {new: true, upsert: false})

  if (!updatedRequest) {
    return {
      err_code: 4007,
      err_msg: 'Unknow error'
    }
  }

  return updatedRequest

}









const mongoose = require('mongoose');
const store = require('../../../utils/store.js')
const Company = require('../../../models').Company
const Template = require('../../../models').Template


module.exports = vendorDetail

async function vendorDetail(obj, args, context, info) {
  
  // 1. check user id 
  let userId = store.getUserId()
  if (!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is empty or not valid'
    }
  }

  // 2. vendor id exists
  let vendorId = args.id
  if (!vendorId) {
    return {
      err_code: 4001,
      err_msg: 'Vendor id is empty'
    }
  }

  // 3. check if vendor id is valid
  let isVendorIdValid = mongoose.Types.ObjectId.isValid(vendorId)
  if (!isVendorIdValid) {
    return {
      err_code: 4002,
      err_msg: 'Vendor id is not valid'
    }
  }


  // 4. get my company
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4001,
      err_msg: 'Can not find user company'
    }
  }

  // 5. is my vendors
  let myVendors = myCompany.vendors
  let isMyVendor = false
  for(let i = 0; i < myVendors.length; i++) {
    if (myVendors[i].toString() === vendorId) {
      isMyVendor = true
      break
    }
  }
  if (!isMyVendor) {
    return {
      err_code: 4002,
      err_msg: 'Can not find vendor in your vendor list'
    }
  }

  // 5. get my vendor by id

  let vendor = await Company.findOne({_id: vendorId})
  return vendor

}
const mongoose = require('mongoose');
const store = require('../../../utils/store.js')
const Company = require('../../../models').Company
const Template = require('../../../models').Template

module.exports = severVendor

// remove vendorId from my company vendors array
async function severVendor(obj, args, context, info) {

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

  // 4. my company exist
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4003,
      err_msg: 'Can not find user company'
    }
  }  

  // 4. vendor must be in my vendor list
  let vendors = myCompany.vendors
  let isMyVendor = false
  for(let i = 0; i < vendors.length; i++) {
    if (vendors[i].toString() === vendorId) {
      isMyVendor = true
      break
    }
  }
  if (!isMyVendor) {
    return {
      err_code: 4004,
      err_msg: 'Can not find vendor in your vendor list'
    }
  }

  // 5. vendor must be a live company
  let vendor = await Company.findOne({_id: vendorId})
  if (vendor.creatorCompanyId) {
    // if creator company exists, it is not a company created by its own user
    return {
      err_code: 4005,
      err_msg: 'Vendor is not a live company, try delete vendor'
    }
  }
  
  // 5. delete vendorId in my vendors
  let myCompanyUpdated = await Company.findOneAndUpdate({_id: myCompany._id}, {
    $pullAll: {vendors: [vendorId]}
  }, {upsert: false, new: true})

  // 6. delete myCompany._id in vendor's clients
  let vendorUpdated = await Company.findOneAndUpdate({
    _id: vendorId
  }, {$pullAll: {clients: [myCompany._id]}})


  return myCompanyUpdated

}
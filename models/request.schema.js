var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;;
var Promise = require('bluebird');
var sanitizer = require('sanitizer');
var mongoosePaginate = require('mongoose-paginate')

mongoose.Promise = Promise;

var requestSchema = new Schema ({

  from_company_id: ObjectId,
  from_company_name: String,
  from_user_name: String,
  
  to_company_id: ObjectId,
  to_company_name: String,

  client_company_id: ObjectId,
  vendor_company_id: ObjectId,
  count: Number,

  status: String
 //   status: 'requested', 'approved', 'rejected', 'delete'

})

requestSchema.statics.findExistingRequest = async function (fromCompany, toCompany, clientCid, vendorCid) {
  // todo...
  
  if (!fromCompany || !toCompany || !clientCid || !vendorCid) {
    return new Error('param can not be empty')
  }

  let request = {
    from_company_id: fromCompany._id,
    
    to_company_id: toCompany._id,

    client_company_id: clientCid,
    vendor_company_id: vendorCid,

    status: 'requested'
  }

  let Request = this.model('Request')

  let res = await Request.findOne(request).lean()

  if (res) {
    return res
  } else {
    return null
  }
}

// can be client request or vendor request
requestSchema.statics.createRequest = async function (fromCompany, toCompany, clientCid, vendorCid, userName) {
  
  if (!fromCompany || !toCompany || !clientCid || !vendorCid || !userName) {
    return null
  }
  // require companyObject, don't deal with company object
  let Request = this.model('Request')

  let request = {
    from_company_id: fromCompany._id,
    from_company_name: fromCompany.name,
    from_user_name: userName,

    to_company_id: toCompany._id,
    to_company_name: toCompany.name,

    client_company_id: clientCid,
    vendor_company_id: vendorCid,

    status: 'requested'
  }

  let existingRequest = await this.isRequestExist(fromCompany, toCompany, clientCid, vendorCid)

  if (existingRequest) {
    return Request.findOneAndUpdate({_id: existingRequest._id }, {$inc: {count: 1} }, {upsert: false, new: true})
  }

  return Request.create(request)
}

requestSchema.statics.approveRequest = function (requestId, toCompanyId) {
  // valid
  if (!requestId || !toCompanyId) {
    return null
  }

  let Request = this.model('Request')

  return Request.findOneAndUpdate({_id: requestId, to_company_id: toCompanyId, status: 'requested'}, {status: 'approved'}, {upsert: false, new: true})
}



requestSchema.statics.rejectRequest = function (requestId, toCompanyId) {
  // valid
  if (!requestId || !toCompanyId) {
    return null
  }

  let Request = this.model('Request')

  return Request.findOneAndUpdate({_id: requestId, to_company_id: toCompanyId, status: 'requested'}, {status: 'rejected'}, {upsert: false, new: true})
}

requestSchema.statics.deleteRequest = function (requestId, fromCompanyId) {
  // user can only delete his company request
  if (!requestId || !fromCompanyId) {
    return null
  }
  let Request = this.model('Request')
  
  return Request.deleteOne({_id: requestId, from_company_id: fromCompanyId, status: 'requested' })
}

requestSchema.statics.receivedRequestList = function (toCompanyId, offset, limit) {

  if(!toCompanyId) {
    return null
  }

  let Request = this.model('Request')

  return Request.paginate({to_company_id: toCompanyId}, {offset: offset, limit: limit, lean: true})
  // it is an array
}

requestSchema.statics.sentRequestList = function (fromCompanyId, offset, limit) {

  if(!fromCompanyId) {
    return null
  }

  let Request = this.model('Request')

  return Request.paginate({from_company_id: fromCompanyId}, {offset: offset, limit: limit, lean: true})
}

requestSchema.statics.deleteRequest = function (requestId, fromCompanyId) {
  if(!requestId || !fromCompanyId) {
    return null
  }

  let Request = this.model('Request')

  return Request.deleteOne({_id: requestId, from_company_id: fromCompanyId })
}


requestSchema.plugin(mongoosePaginate)

module.exports = requestSchema
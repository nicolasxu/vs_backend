var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;;
var Promise = require('bluebird');
var sanitizer = require('sanitizer');

mongoose.Promise = Promise;

var requestSchema = new Schema ({
  type: String, // 'client', 'vendor'
  to_cid: ObjectId,
  to_name: String,
  from_cid: ObjectId,
  from_name: String,
  status: String, // 'pending', 'approved', 'rejected'
  created: Number, // milliSeconds
  updated: Number  // milliSeconds
})

requestSchema.methods.createRequest = function () {
  var requestJson = this.toJSON()
  var Request = this.model('Request')
  requestJson.created = new Date().getTime()
  requestJson.updated = requestJson.created
  requestJson.status = 'pending'

  return Request.create(requestJson)

}

requestSchema.methods.approve = function () {
  var Request = this.model('Request')
  return Request.findByIdAndUpdate(this._id, {status: 'approved', updated: new Date().getTime()}, {new: true})
    .then(function(updatedRequest) {
      // todo
      // 1. update client
      // 2. update vendor
    })
}

requestSchema.methods.reject = function () {
  var Request = this.model('Request')
  return Request.findByIdAndUpdate(this._id, {status: 'rejected', updated: new Date().getTime()}, {new: true})

}

requestSchema.statics.listReceived = function (my_cid, option) {
  // e.g.: option = {status: 'pending'}
  if (typeof option === void 0) {
    option = {}
  }
}

requestSchema.statics.listSent = function (my_cid, option) {
  if (typeof option === void 0) {
    option = {}
  }
}



module.exports = requestSchema
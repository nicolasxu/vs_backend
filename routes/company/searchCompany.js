var messages = require('../messages.js')
var Company = require('../../models').Company
var _ = require('lodash')
var User = require('../../models').User


module.exports = searchActiveCompanyByEmail

// currently, only search by creator email only
function searchActiveCompanyByEmail (req, res, next) {
  console.log(req.query)
  User.findOne({email: req.query.email})
    .then(function(user) {
      // user is mongoose object with methods
      if(!user) {
        var returnJson = _.cloneDeep(messages.findPublicCompanySucceed)
        returnJson.data.company = null
        res.status(200).json(returnJson)
        return
      }
      Company.findOne({creator: user._id.toString()})
        .then(function (company) {
          var returnJson = _.cloneDeep(messages.findPublicCompanySucceed)
          returnJson.data.company = company // toJson() method is automatically called
          res.status(200).json(returnJson)
        })
    }, function (err) {
      var returnJson = _.cloneDeep(messages.findPublicCompanyErr)
      returnJson.data.err = err
      res.status(200).json(returnJson)
    })
  
}
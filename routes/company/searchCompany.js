var messages = require('../messages.js')
var Company = require('../../models').Company
var _ = require('lodash')


module.exports = searchActiveCompany

// currently, only search by email
function searchActiveCompany (req, res, next) {
  Company.find({email: req.body.email, public: true})
    .then(function(companies) {
      var returnJson = _.cloneDeep(messages.findPublicCompanySucceed)
      returnJson.data.companies = companies
      res.status(200).json(returnJson)
    }, function (err) {
      var returnJson = _.cloneDeep(messages.findPublicCompanySucceed)
      returnJson.data.err = err
      res.status(200).json(returnJson)
    })
}
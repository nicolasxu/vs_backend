var messages = require('../messages.js')
var Company = require('../../models').Company
var _ = require('lodash')
var checkLogin = require('../user/checkLogin.js')

module.exports = getCompany

function getCompany(req, res, next) {
  // var userId = mongoose.Types.ObjectId();
  Company.findOne({members: {$in: [req.session.user._id]}})
    .then(function(myCompany) {

      var jsonResult = _.cloneDeep(messages.getCompanySuccess);
      jsonResult.data.company = myCompany;

      res.status(200).json(jsonResult);
    });
}
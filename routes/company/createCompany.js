var messages = require('../messages.js')
var Company = require('../../models').Company
var _ = require('lodash')
var checkLogin = require('../user/checkLogin.js')

module.exports = createCompany

function createCompany(req, res, next) {

  // for creating user's own company only 
  var company = new Company({name: req.body.name, emails: req.body.emails });

  // 1. check if user created company already
  //    user is login already, get user._id from session
  company.isUserInOtherCompany(req.session.user._id)
    .then(function(isInOtherCompany){
      if(isInOtherCompany === false ) {
        return company.createCompany(req.session.user._id)
          .then(function (result) {

            // result contains the company created. 
            var msgJson = _.cloneDeep(messages.createCompanySuccess);
            msgJson.data.company = result;
            res.status(200).json(msgJson);
          }); 
      } else {
        res.status(200).json(messages.userHasCompanyAlready);
        return;
      }
    })
}



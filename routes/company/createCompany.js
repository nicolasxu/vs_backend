var messages = require('../messages.js')
var Company = require('../../models').Company
var _ = require('lodash')

module.exports = createCompany

function createCompany(req, res, next) {

  // for creating user's own company only 
  var company = new Company({
    name: req.body.name, 
    addressLine1: req.body.address1,
    addressLine2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    tel: req.body.tel,
    eid: req.body.eid
  });

  // 1. check if user created company already
  //    user is login already, get user._id from session
  company.isUserInOtherCompany(req.session.user._id)
    .then(function(isInOtherCompany){
      if(isInOtherCompany === false ) {
        return company.createCompany(req.session.user._id)
          .then(function (createdCompany) {

            // createdCompany contains the company created. 
            var msgJson = _.cloneDeep(messages.createCompanySuccess);
            msgJson.data.company = createdCompany;
            res.status(200).json(msgJson);
          }); 
      } else {
        res.status(200).json(messages.userHasCompanyAlready);
        return;
      }
    })
}



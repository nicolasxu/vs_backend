// create credential

var User = require('../models/').User;
var _ = require('lodash');
var cors = require('cors');
var Company = require('../models').Company;
var messages = require('../messages.js');

module.exports = createCredential

function createCredential (req, res, next) {

  var user = User({email: req.body.email, password: req.body.password});

  // 1. validate email
  if(!user.isEmailValid()) {
    res.status(200).json(messages.invalidEmail);
    return;
  }
  // 2. login
  user.login()
    .then(function(result) {
      return result;
    })
    .then(function(user) {
      if(!user) {
        res.status(200).json(messages.passwordNotMatch);
        return;
      }
      Company.findOne({members: {$in: [user._id]}})
        .then(function(myCompany){
          req.session.user = user;
          req.session.company = myCompany;
          req.session.authenticated = true;
          var copyMsg = _.cloneDeep(messages.userLoginSuccess);
          copyMsg.user = user;
          copyMsg.company = myCompany;
          res.status(200).json(copyMsg);
          return;
        });
    });

}
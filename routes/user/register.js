// this function handles login only

var User = require('../../models/').User
var messages = require('../messages.js')
var checkLogin = require('./checkLogin.js')
var _ = require('lodash')

module.exports = registerUser

function registerUser(req, res, next) {

  var user = new User ({email: req.body.email, password: req.body.password});
  console.log(user)
  // 1. validate email
  if(!user.isEmailValid()) {
    res.status(200).json(messages.invalidEmail);
    return;
  }
  // 2. validate password
  if(!user.isPasswordValid()) {
    res.status(200).json(messages.weakPassword);
    return;
  }

  // 3. validate unique email
  user.isRegisteredAlready()
    .then(function (isRegistered)  {
      if(isRegistered) {
        res.status(200).json(messages.accountExist);
      } else {
        user.createUser()
          .then (function(result) {
              console.log('create user success', result)
              // todo: login user, return newly created user data
              res.status(200).json(messages.createUserSuccess);
              return;
            }
          )
      }
    })
}
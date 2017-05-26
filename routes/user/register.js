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
              //res.status(200).json(messages.createUserSuccess);
              /*
              { n: 1, nModified: 1, ok: 1 }
              */
              if (result.ok === 1) {
                // succeed
                return user.email
              } else {
                return ''
              }
            }
          )
          .then ((userEmail) => {
            if (userEmail) {
              // find one, return user detail
              User.findOne({email: userEmail})
                .then((oneUser) => {
                  if(!oneUser) {
                    res.status(200).json(messages.createUserError)
                    return
                  } else {
                    let returnJson = _.cloneDeep(messages.createUserSuccess)
                    returnJson.data.user = oneUser.toJSON()
                    delete returnJson.data.user.password
                    // login user by setting session
                    req.session.user = oneUser
                    req.session.authenticated = true

                    res.status(200).json(returnJson)
                    return
                  }
                })
            } else {
              // return error msg
              res.status(200).json(messages.createUserError)
              return
            }
          }) 
      }
    })
}
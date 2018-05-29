// this function handles login only

const User = require('../../models/').User
var messages = require('../messages.js')
const sendEmail = require('../../utils/sendEmail.js')
const store = require('../../utils/store.js')
const _ = require('lodash')

module.exports = registerUser

async function registerUser(req, res, next) {

  var userJson = {
    email: req.body.email, 
    password: req.body.password, 
    companyName: req.body.companyName
  }
  console.log(userJson)
  // 1. validate email
  if(!User.isEmailValid(userJson.email)) {
    return res.status(200).json({
      data: {
        register: {
          err_code: 4000,
          err_msg: 'email is not valid'
        }
      }
    })
  }
  // 2. validate password
  if(!User.isPasswordValid(userJson.password)) {
    return res.status(200).json({
      data: {
        register: {
          err_code: 4001,
          err_msg: 'Weak password'
        }        
      }
    })
  }
  // 3. validate company name
  if (!userJson.companyName) {
    return res.status(200).json({
      data: {
        register: {
          err_code: 4002,
          err_msg: 'Company name is empty'
        }        
      }
    })
  }

  // 3. is registered
  let isRegistered = await User.isRegistered(userJson.email)
  if (isRegistered) {
    return res.status(200).json({
      data: {
        register: {
          err_code: 4003,
          err_msg: 'email is used by other account'
        }
      }
    })  //messages.accountExist)
  }

  // 4. create User
  let createRes = await User.createUser(userJson)
  if (createRes.ok !== 1 && createRes.n !== 1) {
    return res.status(200).json({
      data: {
        register: {
          err_code: 4004,
          err_msg: 'Create user error'
        }
      }
    })
  }

  // 5. get created user
  let newUser = await User.findOne({email: userJson.email}).lean()
  let verifyPath = '/verifyemail/' + newUser.emailVerifyHash
  let appDomain = store.getDomainName()
  let query = '?email=' + encodeURIComponent(userJson.email)
  // 5. send verification email
  sendEmail('verify_email', 
    {email: userJson.email, verificationLink: appDomain + verifyPath + query}, 
    userJson.email)

  // 6. return created user without password, verification hash
  return res.status(200).json({
    data: {
      register: {
        err_code: null,
        err_msg: null,
        user: {
          _id: newUser._id,
          email: newUser.email,
          companyName: newUser.companyName,
          companyId: newUser.companyId,
          role: newUser.role,
          active: newUser.active,
          firstName: newUser.firstName,
          lastName: newUser.lastName,         
        }
      }      
    }
  })
}
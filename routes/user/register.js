// this function handles login only

var User = require('../../models/').User
var messages = require('../messages.js')
const sendEmail = require('../../utils/sendEmail.js')
const store = require('../../utils/store.js')
var _ = require('lodash')

module.exports = registerUser

async function registerUser(req, res, next) {

  var userJson = {email: req.body.email, password: req.body.password}
  console.log(userJson)
  // 1. validate email
  if(!User.isEmailValid(userJson.email)) {
    res.status(200).json(messages.invalidEmail);
    return;
  }
  // 2. validate password
  if(!User.isPasswordValid(userJson.password)) {
    res.status(200).json(messages.weakPassword);
    return;
  }

  // 3. is registered
  let isRegistered = await User.isRegistered(userJson.email)
  if (isRegistered) {
    res.status(200).json(messages.accountExist)
    return
  }

  // 4. create User
  let createRes = await User.createUser(userJson)
  if (createRes.ok !== 1 && createRes.n !== 1) {
    res.status(200).json(messages.createUserError)
    return
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
  let returnJson = _.cloneDeep(messages.createUserSuccess)
  returnJson.data.user = {
    _id: newUser._id,
    email: newUser.email, 
    role: newUser.role,
    active: newUser.active,
    firstName: newUser.firstName,
    lastName: newUser.lastName,    
  }
  res.status(200).json(returnJson)

}
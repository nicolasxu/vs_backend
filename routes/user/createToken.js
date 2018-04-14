var User = require('../../models/').User
var message = require('../messages.js')

var _ = require('lodash')
var jwt = require('jsonwebtoken')

const TOKEN_SECRET = require('../../config/token.secret.js').token_secret

module.exports = createToken

async function createToken(req, res, next) {
  console.log(req.body)
  // 1. login
  
  let user = {email: req.body.email, password: req.body.password}
  let userRes = await User.login(user)
 
  if (!userRes) {
    // do not execute code after, or there will be exception
    return res.status(200).json(message.passwordWrong)
  }
  
  // create token
  let token = jwt.sign({data: userRes}, TOKEN_SECRET, {expiresIn: '1h'} )

  let result = _.clone(message.createTokenSuccess)
  result.data.token = token
  result.data.user = userRes
  
  res.json(result)  
}
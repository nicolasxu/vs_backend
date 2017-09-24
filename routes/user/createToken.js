var User = require('../../models/').User
var message = require('../messages.js')

var _ = require('lodash')
var jwt = require('jsonwebtoken')

const TOKEN_SECRET = require('../../config/config.js').token_secret

module.exports = createToken

async function createToken(req, res, next) {
  console.log(req.body)
  // 1. login
  let user = {email: req.body.email, password: req.body.password}

  let result = await User.login(user)

  if (!result) {
    // do not execute code after, or there will be exception
    return res.status(200).json(message.passwordWrong)
  }

  // create token
  let token = jwt.sign({data: result}, TOKEN_SECRET, {expiresIn: '1h'} )
  let msgJson = _.clone(message.createTokenSuccess)
  msgJson.data.token = token
  res.json(msgJson)
}
var User = require('../../models/').User
var messages = require('../messages.js')

var _ = require('lodash')
var jwt = require('jsonwebtoken')

const TOKEN_SECRET = require('../../config/config.js').token_secret

module.exports = createToken

async function createToken(req, res, next) {

  // 1. login
  let user = {email: req.body.email, password: req.body.password}

  let result = await User.login(user)

  if (!result) {
    res.status(200).json('token not created')

  }

  // create token
  let token = jwt.sign({data: result}, TOKEN_SECRET, {expiresIn: '1h'} )

  res.json({
    success: true,
    message: 'token created',
    token: token
  })
}
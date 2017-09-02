var User = require('../../models/').User
var messages = require('../messages.js')

var _ = require('lodash')
var jwt = require('jsonwebtoken')

const TOKEN_SECRET = require('../../config/config.js').token_secret

module.exports = createToken

function createToken(req, res, next) {

  // 1. login
  let user = {email: req.body.email, password: req.body.password}
  User.login(user)
    .then((result) => {
      console.log(result)
      if (result) {
        /* 

          { _id: 59a8a9d9507b4b255a38fd25,
            email: 'nick@nick.com',
            active: true,
            __v: 0 }

        */
        let token = jwt.sign({data: result}, TOKEN_SECRET, {expiresIn: '1h'} )

        res.json({
          success: true,
          message: 'token created',
          token: token
        })

      } else {
        // false
        res.status(200).json('token not created')
      }
    })
  // 2. create token
}

let jwt = require('jsonwebtoken')
const config = require('../config/config.js')

module.exports = verifyToken

function verifyToken(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {

    let decoded = jwt.verify(token, config.token_secret)


    req.user = decoded
    
    next()

  } else {
    res.status(403).json({
      status: false,
      message: 'Can not verify token'
    })
  }

}
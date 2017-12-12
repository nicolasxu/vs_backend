
let jwt = require('jsonwebtoken')
const config = require('../config/config.js')
let store = require('./store.js')

module.exports = verifyToken

function verifyToken(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    let decoded 
    try {
      decoded = jwt.verify(token, config.token_secret)
    } catch (e) {
      return res.status(200).json({
        err_code: 4002,
        message: 'Token can not be verified'
      })
    }

    store.user = decoded.data
    
    return next()

  }

  res.status(200).json({
    err_code: 4003,
    message: 'Token is empty'
  })
  

}
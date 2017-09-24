
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
      return res.status(403).json({
        status: false,
        message: 'Token verification error'
      })
    }

    store.user = decoded.data
    
    return next()

  }

  res.status(403).json({
    status: false,
    message: 'Can not verify token'
  })
  

}
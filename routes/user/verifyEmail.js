// verify user email

var User = require('../../models/').User
var message = require('../messages.js')

module.exports = verifyEmail

async function verifyEmail(req, res, next) {

  let hash = req.body.hash
  let email = req.body.email

  if (!hash || !email) {
    res.status(200).json({
      err_code: 4000,
      err_msg: 'input hash or email is empty'
    })
    return
  }

  let userDoc = await User.findOne({email: email, emailVerifyHash: hash, active: false  })

  if (!userDoc) {
    return res.status(200).json({
      err_code: 4001,
      err_msg: 'Can not find record to verify'
    })
  }

  userDoc.active = true
  userDoc.emailVerifyHash = ''
  let savedUser = await userDoc.save()

  delete savedUser.password
  delete savedUser.emailVerifyHash
  delete savedUser.resetPwdHash
  delete savedUser.resetPwdHashTime

  return res.status(200).json({
    code: 2000,
    data: {
      message: 'ok',
      user: savedUser
    }
  })
}
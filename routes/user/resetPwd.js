
const User = require('../../models/').User
const sendEmail = require('../../utils/sendEmail.js')
const store = require('../../utils/store.js')

module.exports = resetPwd

async function resetPwd(req, res, next) {

  let email = req.body.email
  let hash = req.body.hash
  let pwd = req.body.pwd

  if (!hash || !email || !pwd) {
    return res.status(200).json({
      err_code: 4000,
      err_msg: 'Missing input'
    })
  }

  let isPwdValid = User.isPasswordValid(pwd)
  if (!isPwdValid) {
    return res.status(200).json({
      err_code: 4001,
      err_msg: 'New password is not valid'
    })
  }

  let user = await User.findOne({email: email, resetPwdHash: hash })
  if (!user) {
    return res.status(200).json({
      err_code: 4002,
      err_msg: 'Can not find user by this email and hash'
    })
  }

  // check date, resetPwdHash only valid for 24 hours
  let now = new Date().getTime()
  let hashTime = parseInt(user.resetPwdHashTime)
  if (isNaN(hashTime)) {
    return res.status(200).json({
      err_code: 4003,
      err_msg: 'Reset hash date error'
    })
  }
  if (now - 24 * 60 * 60 * 1000 > hashTime) {
    return res.status(200).json({
      err_code: 4004,
      err_msg: 'Reset hash expired'
    })
  }

  await user.updatePwd(pwd)
  user.resetPwdHash = ''
  await user.save()

  return res.status(200).json({
    code: 2000,
    data: {
      message: 'Password update success!',
      _id: user._id,
      email: user.email
    }
  })
}
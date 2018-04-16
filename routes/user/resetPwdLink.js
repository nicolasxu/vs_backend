
const User = require('../../models/').User
const sendEmail = require('../../utils/sendEmail.js')
const store = require('../../utils/store.js')
const generateSafeId = require('generate-safe-id');


module.exports = resetPwdLink

async function resetPwdLink(req, res, next) {

  let email = req.body.email 
  if (!email) {
    return res.status(200).json({
      err_code: 4000,
      err_msg: 'Email is empty'
    })
  }

  let userRes = await User.findOne({email: email})
  if (!userRes) {
    return res.status(200).json({
      err_code: 4001,
      err_msg: 'Can not find user by this email'
    })
  }

  if (userRes.active === false) {
    return res.status(200).json({
      err_code: 4002,
      err_msg: 'Email is not verified yet'
    })
  }

  userRes.resetPwdHash = generateSafeId()
  userRes.resetPwdHashTime = new Date().getTime().toString()

  await userRes.save()

  // send email with link
  let appDomain = store.getDomainName()
  let resetPath = '/resetPassword/' + userRes.resetPwdHash
  let query = '?email=' + encodeURIComponent(email)
  let sendRes
  try {
    sendRes = await sendEmail('reset_pwd', 
      {resetLink: appDomain + resetPath + query }, 
      email)
  } catch (e) {
    console.log('send reset email error', e.message)
    return res.status(200).json({
      err_code: 4003,
      err_msg: 'Send reset email error'
    })
  }

  if (sendRes && sendRes.accepted.length === 1) {
    // good send
    return res.status(200).json({
      code: 2000,
      data: {
        message: 'Success',
        email: email
      }
    })
  } else {
    return res.status(200).json({
      err_code: 4004,
      err_msg: 'no reset link email sent'
    })
  }
}


/* 


{ accepted: [ '496760@csinow.edu' ],
  rejected: [],
  envelopeTime: 125,
  messageTime: 586,
  messageSize: 813,
  response: '250 2.0.0 OK 1523892897 l52sm10313559qtc.45 - gsmtp',
  envelope: { from: 'xu.shenxin@gmail.com', to: [ '496760@csinow.edu' ] },
  messageId: '<daf0092b-3269-9aca-13c4-ceb3352675da@gmail.com>' }


*/
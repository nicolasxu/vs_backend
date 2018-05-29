// verify user email

const User = require('../../models/').User
const Company = require('../../models').Company

module.exports = verifyEmail

async function verifyEmail(req, res, next) {

  let hash = req.body.hash
  let email = req.body.email

  if (!hash || !email) {
    return res.status(200).json({
      data: {
        verifyEmail: {
          err_code: 4000,
          err_msg: 'input hash or email is empty'          
        }
      }

    })
  }

  let userDoc = await User.findOne({email: email, emailVerifyHash: hash, active: false  })

  if (!userDoc) {
    return res.status(200).json({
      data: {
        verifyEmail: {
          err_code: 4001,
          err_msg: 'Can not find record to verify'          
        }
      }
    })
  }

  // create company
  let myCompany = await Company.createMyCompany(userDoc._id, userDoc.companyName || (userDoc.email + ' Company') )
  if (!myCompany) {
    return res.status(200).json({
      data: {
        verifyEmail: {
          err_code: 4002,
          err_msg: 'Create user company error - Aborting...'
        }
      }
    })
  }

  userDoc.active = true
  userDoc.myCompanyId = myCompany._id
  userDoc.emailVerifyHash = ''
  let savedUser = await userDoc.save()

  delete savedUser.password
  delete savedUser.emailVerifyHash
  delete savedUser.resetPwdHash
  delete savedUser.resetPwdHashTime

  return res.status(200).json({
    data: {
      verifyEmail: {
        err_code: null,
        err_msg: null,
        user: savedUser
      }
    }
  })
}
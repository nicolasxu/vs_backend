
const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
const User = require('../../../models').User

module.exports = getCompanyByEmail

// not my company, but any live company
async function getCompanyByEmail(obj, args, context, info) {

  // 1. email exists
  let email = args.email
  if (!email) {
    return {
      err_code: 4000,
      err_msg: 'Email is empty'
    }
  }

  let myUserId = store.getUserId()

  // 2. my company exist
  let userCompany = await Company.findUserCompany(myUserId)
  if (!userCompany) {
    return {
      err_code: 4001,
      err_msg: 'Can not find user company'
    }
  }

  // 3. find user by email
  let user = await User.findOne({email: email, active: true })
  if (!user) {
    return {
      err_code: 4002,
      err_msg: 'Can not find company with this user email'
    }
  }

  // 4. find company with this user id
  let company = await Company.findUserCompany(user._id)
  if (!company) {
    return {
      err_code: 4003,
      err_msg: 'Can not find company'
    }
  }
  const {invoiceEmails, invoicePersonName, members, 
    vendors, clients, templates, ...partialCompany  } = company
  
  return partialCompany

}







const Company = require('../../../models').Company
let store = require('../../../utils/store.js')


module.exports = getCompanyDetail


async function getCompanyDetail(obj, args, context, info) {

  let userId = store.getUserId()
  
  if(!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not valid or empty'
    }
  }
  let userCompany = await Company.findUserCompany(userId)
  if (!userCompany) {
    return {
      err_code: 4001,
      err_msg: 'Can not find user company'
    }
  }

  return userCompany
}
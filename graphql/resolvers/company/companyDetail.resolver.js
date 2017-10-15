
const Company = require('../../../models').Company
let store = require('../../../utils/store.js')


module.exports = getCompanyDetail


function getCompanyDetail(obj, args, context, info) {

  let userId = store.getUserId()
  console.log('user id in getCompanyDetail:', userId)
  if(!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not valid or empty'
    }
  }
  return Company.findUserCompany(userId)
}
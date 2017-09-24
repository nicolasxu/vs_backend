
const Company = require('../../../models').Company
let store = require('../../../utils/store.js')


module.exports = getCompanyDetail


function getCompanyDetail(obj, args, context, info) {

  let _id = store.user && store.user._id
  console.log('user id in getCompanyDetail:', _id)
  if(!_id) {
    return ''
  }

  return Company.findOne({members: {'$in': [_id]}})

}
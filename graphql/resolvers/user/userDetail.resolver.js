
const User = require('../../../models').User
let store = require('../../../utils/store.js')
module.exports = userDetail


async function userDetail(obj, args, context, info) {

  let _id = store.user._id

  let user = await User.findOne({_id: _id})

  return user.toJSON()

}
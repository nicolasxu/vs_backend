
const userDetail = require('./user/userDetail.resolver.js')

let resolver = {
  Query: {
    user: userDetail
  },
  Mutation: {

  }
}

module.exports = resolver
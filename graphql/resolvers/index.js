
const userDetail = require('./user/userDetail.resolver.js')
const createMyCompany = require('./company/createMyCompany.resolver.js')
const myCompanyDetail = require('./company/companyDetail.resolver.js')

let resolver = {
  Query: {
    user: userDetail,
    myCompany: myCompanyDetail
  },
  Mutation: {
    createMyCompany: createMyCompany

  }
}

module.exports = resolver
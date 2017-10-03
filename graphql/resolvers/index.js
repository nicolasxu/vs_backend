
const userDetail = require('./user/userDetail.resolver.js')
const createMyCompany = require('./company/createMyCompany.resolver.js')
const myCompanyDetail = require('./company/companyDetail.resolver.js')
const createMyClient = require('./client/createMyClient.js')
const deleteMyClient = require('./client/deleteMyClient.js')
const updateMyClient = require('./client/updateMyClient.js')
const myClients = require('./client/myClients.js')
const myVendors = require('./vendor/myVendors.js')

let resolver = {
  Query: {
    user: userDetail,
    myCompany: myCompanyDetail,
    clients: myClients,
    vendors: myVendors

  },
  Mutation: {
    createMyCompany: createMyCompany,
    createMyClient: createMyClient,
    deleteMyClient: deleteMyClient,
    updateMyClient: updateMyClient

  }
}

module.exports = resolver
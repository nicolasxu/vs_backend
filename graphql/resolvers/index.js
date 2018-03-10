
const userDetail = require('./user/userDetail.resolver.js')
const createMyCompany = require('./company/createMyCompany.resolver.js')
const myCompanyDetail = require('./company/companyDetail.resolver.js')
const createMyClient = require('./client/createMyClient.js')
const deleteMyClient = require('./client/deleteMyClient.js')
const updateMyClient = require('./client/updateMyClient.js')
const getMyClientDetail = require('./client/getMyClientDetail.js')

const myClients = require('./client/listMyClients.js')
const myVendors = require('./vendor/myVendors.js')

const createRequest = require('./request/createRequest.js')
const approveRequest = require('./request/apporveRequest.js')
const rejectRequest = require('./request/rejectRequest.js')
const deleteRequest = require('./request/deleteRequest.js')
const sentRequest = require('./request/sentRequests.js')
const receivedRequest = require('./request/receivedRequests.js')
const requestDetail = require('./request/getRequestDetail.js')

const getTemplateById = require('./template/getTemplateById.js')

let resolver = {
  Query: {
    user: userDetail,
    myCompany: myCompanyDetail,
    clients: myClients,
    vendors: myVendors,
    clientDetail: getMyClientDetail,
    sentRequests: sentRequest,
    receivedRequests: receivedRequest,
    requestDetail: requestDetail,
    template: getTemplateById

  },
  Mutation: {
    createMyCompany: createMyCompany,
    createMyClient: createMyClient,
    deleteMyClient: deleteMyClient,
    updateMyClient: updateMyClient,

    createRequest: createRequest,
    approveRequest: approveRequest,
    rejectRequest: rejectRequest,
    deleteRequest: deleteRequest

  }
}

module.exports = resolver
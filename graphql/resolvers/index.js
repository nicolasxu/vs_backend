
const userDetail = require('./user/userDetail.resolver.js')
const createMyCompany = require('./company/createMyCompany.resolver.js')
const myCompanyDetail = require('./company/companyDetail.resolver.js')
const getCompanyByEmail = require('./company/getCompanyByEmail.js')

const createMyClient = require('./client/createMyClient.js')
const deleteMyClient = require('./client/deleteMyClient.js')
const updateMyClient = require('./client/updateMyClient.js')
const severClientRelationship = require('./client/severClientRelationship.js')

const myClients = require('./client/listMyClients.js')
const getMyClientDetail = require('./client/getMyClientDetail.js')
const searchClients = require('./client/searchClients.js')

const listMyVendors = require('./vendor/listMyVendors.js')
const vendorDetail = require('./vendor/vendorDetail.js')
const severVendorRelationship = require('./vendor/severVendorRelationship.js')

const createRequest = require('./request/createRequest.js')
const approveRequest = require('./request/apporveRequest.js')
const withdrawRequest = require('./request/withdrawRequest.js')
const rejectRequest = require('./request/rejectRequest.js')
const deleteRequest = require('./request/deleteRequest.js')
const sentRequest = require('./request/sentRequests.js')
const receivedRequest = require('./request/receivedRequests.js')
const requestDetail = require('./request/getRequestDetail.js')

const getTemplateById = require('./template/getTemplateById.js')
const getTemplates = require('./template/getTemplates.js')
const deleteTemplate = require('./template/deleteTemplate.js')
const updateTemplate = require('./template/updateTemplate.js')
const createTemplate = require('./template/createTemplate.js')

const createProduct = require('./product/createProduct.js')
const deleteProduct = require('./product/deleteProduct.js')
const updateProduct = require('./product/updateProduct.js')
const getProductDetail = require('./product/getProductDetail.js')
const getProducts = require('./product/getProducts.js')
const findProducts = require('./product/findProducts.js')

const createInvoice = require('./invoice/createInvoice.js')
const voidInvoice = require('./invoice/voidInvoice.js')
const getInvoiceList = require('./invoice/getInvoiceList.js')
const getInvoiceById = require('./invoice/getInvoiceById.js')

let resolver = {
  Query: {
    user: userDetail,
    myCompany: myCompanyDetail,
    getCompanyByEmail: getCompanyByEmail,
    clients: myClients,
    clientDetail: getMyClientDetail,
    clientsSearch: searchClients,

    vendors: listMyVendors,
    vendor: vendorDetail,
    
    sentRequests: sentRequest,
    receivedRequests: receivedRequest,
    requestDetail: requestDetail,
    template: getTemplateById,
    templates: getTemplates,

    product: getProductDetail,
    products: getProducts,
    productFind: findProducts,

    invoice: getInvoiceById,
    invoices: getInvoiceList

  },
  Mutation: {
    createMyCompany: createMyCompany,
    createMyClient: createMyClient,
    deleteMyClient: deleteMyClient,
    updateMyClient: updateMyClient,

    severClientRelationship: severClientRelationship,
    severVendorRelationship: severVendorRelationship,

    createRequest: createRequest,
    approveRequest: approveRequest,
    withdrawRequest: withdrawRequest,
    rejectRequest: rejectRequest,
    deleteRequest: deleteRequest,

    createTemplate: createTemplate,
    updateTemplate: updateTemplate,
    deleteTemplate: deleteTemplate,

    createProduct: createProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,

    createInvoice: createInvoice,
    voidInvoice: voidInvoice

  }
}

module.exports = resolver
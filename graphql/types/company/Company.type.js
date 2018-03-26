module.exports = `

type Company {
  _id: String
  name: String

  creator: String
  isActive: Boolean
  invoiceEmails: [String]
  invoicePersonName: String
  members: [User]
  clients: [String]
  vendors: [String]
  templates: [String]

  addressLine1: String
  addressLine2: String
  city: String
  state: String
  zip: String
  country: String
  tel: String
  website: String
  serviceDesc: String
  
  createdAt: String
  updatedAt: String
  
  creatorCompanyId: String

  err_code: Int
  err_msg: String
}


`
module.exports = `

type Company {
  _id: String
  name: String
  isPrivate: Boolean
  creator: String
  active: Boolean
  invoiceEmails: [String]
  members: [User]
  templates: [String]

  addressLine1: String
  addressLine2: String
  city: String
  state: String
  zip: String
  country: String
  
  
  createdAt: String
  updatedAt: String
}


`
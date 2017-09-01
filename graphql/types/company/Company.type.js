module.exports = `

type Company {
  _id: String
  name: String
  isPrivate: Boolean
  creator: String
  invoiceEmail: [String]
  
  addressLine1: String
  addressLine2: String
  city: String
  state: String
  zip: String
  
  clients: [Company]
  vendor: [Company]
  createdAt: String
  updatedAt: String
}


`
module.exports = `

type Company {
  _id: String
  name: String
  public: Boolean
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
  tel: String
  
  createdAt: String
  updatedAt: String

  err_code: Int
  err_msg: String
}


`
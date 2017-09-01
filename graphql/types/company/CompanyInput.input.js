
// add client will be handled in ClientInput type

module.exports = `

input CompanyInput {
  name: String
  addEmail: [String]
  removeEmail: [String]
  
  addressLine1: String
  addressLine2: String
  city: String
  state: String
  zip: String

}

`

module.exports = `

type Mutation {
  
  createUser(input: UserInput): User
  createMyCompany(input: CompanyInput): Company

  createMyClient(input: CompanyInput): Company
  updateMyClient(input: CompanyInput): Company
  deleteMyClient(id: String): RecordDelete

  createClientRequest(id: String): Request
  createVendorRequest(id: String): Request
    
  approveRequest(id: String): Request
  rejectRequest(id: String): Request
  widthdrawRequest(id: String): Request



}


`
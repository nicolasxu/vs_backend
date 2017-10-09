
module.exports = `

type Mutation {
  
  createUser(input: UserInput): User
  createMyCompany(input: CompanyInput): Company

  createMyClient(input: CompanyInput): Company
  updateMyClient(id: String, input: CompanyInput): Company
  deleteMyClient(id: String): RecordDelete

  createRequest(toEmail: String, toIs: String): Request
  approveRequest(id: String): Request
  rejectRequest(id: String): Request
  deleteRequest(id: String): Request



}


`
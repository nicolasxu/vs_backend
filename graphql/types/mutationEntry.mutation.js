
module.exports = `

type Mutation {
  
  createUser(input: UserInput): User
  createMyCompany(input: CompanyInput): Company

  createMyClient(input: CompanyInput): Company
  updateMyClient(id: String, input: CompanyInput): Company
  deleteMyClient(id: String): RecordDelete

  createRequest(toEmail: String, toIs: String): Request
  approveRequest(requestId: String): Request
  rejectRequest(requestId: String): Request
  deleteRequest(requestId: String): Request

  createTemplate(input: TemplateInput): Template
  updateTemplate(id: String, input: TemplateInput): Template
  deleteTemplate(id: String): RecordDelete




}


`
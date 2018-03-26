
module.exports = `

type Mutation {
  
  createUser(input: UserInput): User
  createMyCompany(input: CompanyInput): Company

  createMyClient(input: CompanyInput): Company
  updateMyClient(id: String, input: CompanyInput): Company
  deleteMyClient(id: String): RecordDelete
  severClientRelationship(id: String): Company

  severVendorRelationship(id: String): Company

  createRequest(toEmail: String, toIs: String): Request
  approveRequest(requestId: String): Request
  rejectRequest(requestId: String): Request
  deleteRequest(requestId: String): Request

  createTemplate(input: TemplateInput): Template
  updateTemplate(id: String, input: TemplateInput): Template
  deleteTemplate(id: String): RecordDelete

  createProduct(input: ProductInput) : Product
  updateProduct(id: String, input: ProductInput) : Product
  deleteProduct(id: String): RecordDelete


}


`
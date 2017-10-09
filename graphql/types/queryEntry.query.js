module.exports = `

type Query {

  hello: String
  user: User
  
  clients(offset: Int, limit: Int): CompanyList
  clientDetail(id: String): Company

  receivedRequests: RequestList
  sentRequests: RequestList

  
  vendors(offset: Int, limit: Int): CompanyList
  vendorDetail: Company
  myCompany: Company

  
  
}

`
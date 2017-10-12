module.exports = `

type Query {

  hello: String
  user: User
  
  clients(offset: Int, limit: Int): CompanyList
  clientDetail(id: String): Company

  receivedRequests(offset:Int, limit: Int): RequestList
  sentRequests(offset:Int, limit: Int): RequestList

  
  vendors(offset: Int, limit: Int): CompanyList
  vendorDetail: Company
  myCompany: Company

  
  
}

`
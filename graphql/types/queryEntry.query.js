module.exports = `

type Query {

  hello: String
  user: User
  
  clients(offset: Int, limit: Int): CompanyList
  clientDetail: Company
  
  vendors(offset: Int, limit: Int): CompanyList
  vendorDetail: Company
  myCompany: Company
 
  
  
}

`
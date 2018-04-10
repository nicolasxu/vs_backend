module.exports = `

type Query {

  hello: String
  user: User
  
  clients(offset: Int, limit: Int): CompanyList
  clientDetail(id: String): Company

  vendors(offset: Int, limit: Int): CompanyList
  vendor(id: String): Company


  receivedRequests(offset:Int, limit: Int): RequestList
  sentRequests(offset:Int, limit: Int): RequestList
  requestDetail(requestId: String): Request

  vendors(offset: Int, limit: Int): CompanyList
  vendorDetail: Company
  myCompany: Company

  templates: TemplateList
  template(id: String): Template

  products(offset: Int, limit: Int): ProductList
  product(id: String): Product
  productFind(searchStr: String): ProductList

  invoice(id: String): Invoice
  invoices(offset: Int, limit: Int): InvoiceList



}

`
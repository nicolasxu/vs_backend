
module.exports = `

type Request {
  _id: String
  
  from_company_id: String
  from_company_name: String
  from_user_name: String
  
  to_company_id: String
  to_company_name: String

  client_company_id: String
  vendor_company_id: String
  count: Int

  status: String
  createdAt: String
  updatedAt: String


}





`
/*

  type can be 'client' or 'vendor'
  client: 'to' is the client of 'from'
  vendor: 'to' is vendor of 'from'

  status: 'requested', 'approved', 'rejected', 'delete'
*/
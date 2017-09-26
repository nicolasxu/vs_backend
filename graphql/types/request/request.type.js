
module.exports = `

type Request {
  _id: String
  
  from_company_id: String
  from_company_name: String
  from_user_name: String
  
  to_company_id: String
  to_company_name: String
  
  status: String
  type: String
  created: String
  updated: String


}





`
/*

  type can be 'client' or 'vendor'
  client: to is the client of from
  vendor: to is vendor of from

  status: 'approved', 'rejected', 'widthdrew'
*/
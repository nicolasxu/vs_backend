
module.exports = `

type RequestList {
  docs: [Request]
  total: Int
  limit: Int
  offset: Int
  err_code: Int
  err_msg: String
}

`
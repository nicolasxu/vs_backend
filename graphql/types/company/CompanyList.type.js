module.exports = `

  type CompanyList {
    docs: [Company]
    total: Int
    limit: Int
    offset: Int
    err_code: Int
    err_msg: String
  }

`
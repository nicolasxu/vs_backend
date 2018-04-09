module.exports = `

  type InvoiceList {
    docs: [Invoice]
    total: Int
    limit: Int
    offset: Int
    err_code: Int
    err_msg: String     
  }

`
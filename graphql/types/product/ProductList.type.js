module.exports = `

type ProductList {
  docs: [Product]
  total: Int
  limit: Int
  offset: Int
  err_code: Int
  err_msg: String  
}

`
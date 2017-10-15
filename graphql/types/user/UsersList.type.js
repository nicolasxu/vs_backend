
module.exports = `
  
  type UserList {
    docs: [User]
    total: Int
    limit: Int
    offset: Int
    err_code: Int
    err_msg: String
  }

`
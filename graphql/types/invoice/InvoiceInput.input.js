module.exports = `

  input FromCompanyInput {
    cId: String
    cName: String
    uId: String
    uName: String    
  }

  input ToCompanyInput {
    cId: String
    cName: String    
  }
  
  input InvoiceInput {
    fromCompany: FromCompanyInput
    toCompany: ToCompanyInput
    invoiceNumber: String
    amount: Float
    sentDate: Int
    dueDate: Int
    term: String
  }


`
module.exports = `
  
  input InvoiceInput {
    fromCompanyId: String
    toCompanyId: String
    templateId: String
    amount: Int
    sentDate: Int
    dueDate: Int
    term: String
  }


`
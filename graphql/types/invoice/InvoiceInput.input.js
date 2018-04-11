module.exports = `
  
  input InvoiceInput {
    
    toCompanyId: String
    templateId: String
    items: String
    customData: String
    amount: Int
    invoiceDate: Int
    dueDate: Int
    term: String
  }


`
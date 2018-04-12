module.exports = `
  
  input InvoiceTermInput {
    day: Int
    desc: String
  }

  input InvoiceInput {  
    toCompanyId: String
    templateId: String
    items: String
    customData: String
    total: Int
    invoiceDate: String
    dueDate: String
    term: InvoiceTermInput
    note: String
  }


`
module.exports = `
  
  input InvoiceTerm {
    day: Int
    desc: String
  }

  input InvoiceInput {  
    toCompanyId: String
    templateId: String
    items: String
    customData: String
    total: Int
    invoiceDate: Int
    dueDate: Int
    term: InvoiceTerm
    note: String
  }


`
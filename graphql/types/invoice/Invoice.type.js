module.exports = `
  
  type FromCompany {
    companyId: String
    name: String
    userId: String
    userName: String
  }

  type ToCompany {
    companyId: String
    name: String
  }

  type InvoiceTerm {
    _id: String
    day: Int
    desc: String
  }
  
  type Invoice {
    _id: String
    fromCompany: FromCompany
    toCompany: ToCompany
    templateId: String
    viewId: String
    number: String
    total: Int
    invoiceDate: String
    dueDate: String
    term: InvoiceTerm
    renderedInvoice: String
    status: String
    viewed: Boolean
    paymentStatus: String
    transactionId: String
    paidDate: Int

    err_code: Int
    err_msg: String    
  }


`
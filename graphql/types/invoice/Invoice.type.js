module.exports = `
  
  type FromCompany {
    cId: String
    cName: String
    uId: String
    uName: String
  }

  type ToCompany {
    cId: String
    cName: String
  }
  
  type Invoice {
    _id: String
    fromCompany: FromCompany
    toCompany: ToCompany
    invoiceNumber: String
    amount: Float
    sentDate: Int
    dueDate: Int
    term: String
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
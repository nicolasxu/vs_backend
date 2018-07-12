const Invoice = require('../../models').Invoice
const Company = require('../../models').Company
const validateRoutingNumber = require('../../utils/validateRoutingNumber.js')
const validateBankAccount = require('../../utils/validateBankAccount.js')
module.exports = payAndRegister

async function payAndRegister(req, res, next) {

  let email = req.body.email? req.body.email.trim(): ''
  let routingNumber = req.body.routingNumber
  let bankAccountNumber = req.body.bankAccount
  let invoiceViewId = req.body.viewId
  let password = req.body.password

  // 1. Validation
  if (!email) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4000,
          err_msg: 'Invoice receiving email is empty'
        }
      }
    })
  }

  if (!routingNumber) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4001,
          err_msg: 'Bank routing number is empty'
        }
      }
    })
  }
  routingNumber = routingNumber.toString().trim()
  // routing number is 9 digits in US
  if (!validateRoutingNumber(routingNumber)) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4002,
          err_msg: 'Routing number is not valid'
        }
      }
    })    
  }

  if (!bankAccountNumber) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4003,
          err_msg: 'Bank account number is empty'
        }
      }
    })
  }
  bankAccountNumber = bankAccountNumber.toString().trim()
  if (!validateBankAccount(bankAccountNumber)) {

    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4004,
          err_msg: 'Bank account number is not valid'
        }
      }
    })

  }

  if (!invoiceViewId) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4005,
          err_msg: 'Invoice viewId is empty'
        }
      }
    })
  }

  // 2. invoice exists
  let invoice = await Invoice.findOne({viewId: invoiceViewId})
  if (!invoice) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4006,
          err_msg: 'Can not find invoice by viewId'
        }
      }
    })
  }

  // 3. correct payment status
  if (invoice.paymentStatus === 'paid' || invoice.paymentStatus === 'pending' ) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4007,
          err_msg: 'Invoice payment status is paid or pending'
        }
      }
    })
  }

  // 4. toCompany exists
  let toCompanyId = invoice.toCompany.companyId
  let toCompany = await Company.findOne({_id: toCompanyId})

  if (!toCompany) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4008,
          err_msg: 'Can not find email receiving company'
        }        
      }
    })    
  }

  // 5. email belongs to toCompany
  let toEmail = toCompany.invoiceEmails[0] ? toCompany.invoiceEmails[0].trim(): ''

  if (toEmail !== toEmail) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4009,
          err_msg: 'Email does not match to company email'
        }        
      }
    })
  }

  // 6. toCompany is not private company (this api is only for 1st time payer)
  if (!toCompany.creatorCompanyId) {
    return res.status(200).json({
      data: {
        payAndRegister: {
          err_code: 4010,
          err_msg: 'email receiving company is not an active company'
        }        
      }
    })    
  }

  // todo:
  // - change existing company records
  // - change existing invoice records
  // - call payment api to pay the invoice



}
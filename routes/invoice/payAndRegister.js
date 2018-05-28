const Invoice = require('../../models').Invoice
const Company = require('../../models').Company
const validateRoutingNumber = require('../../utils/validateRoutingNumber.js')
const validateBankAccount = require('../../utils/validateBankAccount.js')
module.exports = payAndRegister

async function payAndRegister(req, res, next) {

  let email = req.body.email
  let routingNumber = req.body.routingNumber
  let bankAccountNumber = req.body.bankAccount
  let invoiceViewId = req.body.viewId

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

  // 4. email belong to toCompany

  /* 5. email does not belong to live company
      email can belong to a live company:
      A company sent invoice to B company (private),
      Then a user use toCompany email to create a live company
      

  */
  // 







}
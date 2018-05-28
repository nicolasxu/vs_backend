const Invoice = require('../../models').Invoice
const Company = require('../../models').Company
const jwt = require('jsonwebtoken')
const config = require('../../config/token.secret.js')

module.exports = getInvoiceByViewId

// TODO: add a field to tell if to company is alive
async function getInvoiceByViewId(req, res, next) {

  // viewId exist
  let viewId = req.params.viewid
  if (!viewId) {
    return res.status(200).json({
      data: {
        invoiceByViewId: {
          err_code: 4000,
          err_msg: 'no viewId'
        }
      }
      
    })
  }

  // 1. get invoice by viewId
  let invoice = await Invoice.findOne({viewId: viewId})
  if (!invoice) {
    return res.status(200).json({
      data: {
        invoiceByViewId: {
          err_code: 4001,
          err_msg: 'Can not find invoice'          
        }
      }

    })
  }

  // 2. find if to_company is a live company
  let toCompanyIs
  let toCompany = Company.findOne({_id: invoice.toCompany.companyId })
  // it is possible user send invoice and delete the toCompany
  if (toCompany) {
    toCompanyIs = toCompany.creatorCompanyId? 'not_live': 'live'
  } else {
    toCompanyIs = 'not_exist'
    // it is because either:
    // 1) user delete toCompany after sending invoice
    // 2) toCompany delete itself

    // either way toCompany doesn't exist, user can just pay invoice
    // without creating user account
  }

  // 3. parse to token to find out who user is
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  
  let user
  if (token) {
    // decode here
    let decoded 
    try {
      decoded = jwt.verify(token, config.token_secret)
      console.log('decoded', decoded )
    } catch (e) {
      console.log('decode token error', e)
    }
    if (decoded) {
      user = decoded.data
    } 
  }

  if (!user) {
    // find out if user is in from_company or to_company
    return res.status(200).json({
      data: {
        invoiceByViewId: {
          err_code: null,
          err_msg: null,
          invoice: invoice,
          user: null,
          loginUserIs: null,
          toCompanyIs: toCompanyIs
        }
      }
    })
  }

   
  // 4. findUserBelong and send signal
  if (!user.email) {
    return res.status(200).json({
      data: {
        invoiceByViewId: {
          err_code: 4002,
          err_msg: 'Can not find user email'          
        }
      }

    })
  }
  if (!user._id) {
    return res.status(200).json({
      data: {
        invoiceByViewId: {
          err_code: 4003,
          err_msg: 'User does not have token'          
        }
      }

    })
  }

  let userCompany = await Company.findUserCompany(user._id)
  if (!userCompany) {
    return res.status(200).json({
      data: {
        invoiceByViewId: {
          err_code: 4004,
          err_msg: 'Can not find user company by id'          
        }
      }

    })
  }
  let loginUserIs
  let userCompanyIdStr = userCompany._id.toString()
  console.log('userCompanyIdStr', userCompanyIdStr)
  console.log('fromCompany', invoice.fromCompany.companyId.toString())
  console.log('toCompany', invoice.toCompany.companyId.toString())
  switch (userCompanyIdStr) {
    case invoice.fromCompany.companyId.toString():
      loginUserIs = 'sender'
      break;
    case invoice.toCompany.companyId.toString():
      loginUserIs = 'receiver'
      break;
    default:
      loginUserIs = null
  }

  // 5. return data 
  
  return res.status(200).json({
    data: {
      invoiceByViewId: {
        err_code: null,
        err_msg: null,
        invoice: invoice,
        user: user,
        loginUserIs: loginUserIs,
        toCompanyIs: toCompanyIs
      }
    }
  })
}
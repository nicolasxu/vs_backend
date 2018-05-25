const Invoice = require('../../models').Invoice
const Company = require('../../models').Company

module.exports = getInvoiceByViewId


async function getInvoiceByViewId(req, res, next) {

  // viewId exist
  let viewId = req.params.viewid
  if (!viewId) {
    return res.status(200).json({
      err_code: 4000,
      err_msg: 'no viewId'
    })
  }

  // 1. get invoice by viewId
  let invoice = await Invoice.findOne({viewId: viewId})
  if (!invoice) {
    return res.status(200).json({
      err_code: 4001,
      err_msg: 'Can not find invoice'
    })
  }
  // 2. parse to token to find out who user is
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  let user
  if (token) {
    // decode here
    let decoded 
    try {
      decoded = jwt.verify(token, config.token_secret)
    } catch (e) {
      
    }
    if (decode) {
      user = decoded.data
    } 
  }

  if (!user) {
    // find out if user is in from_company or to_company
    return res.status(200).json({
      err_code: null,
      err_msg: null,
      data: {
        invoice: invoice,
        user: null,
        loginUserIs: null
      }
    })
  }

   
  // 3. findUserBelong and send signal
  if (!user.email) {
    return res.status(200).json({
      err_code: 4002,
      err_msg: 'Can not find user email'
    })
  }
  if (!user._id) {
    return res.status(200).json({
      err_code: 4003,
      err_msg: 'User does not have token'
    })
  }

  let userCompany = await Company.findUserCompany(user._id)
  if (!userCompany) {
    return res.status(200).json({
      err_code: 4004,
      err_msg: 'Can not find user company by id'
    })
  }
  let returnData = {}
  let userCompanyIdStr = userCompany._id.toString()

  switch (userCompanyIdStr) {
    case invoice.fromCompany.companyId.toString():
      returnData.loginUserIs = 'sender'
      break;
    case invoice.toCompany.companyId.toString():
      returnData.loginUserIs = 'receiver'
      break;
    default:
      returnData.loginUserIs = null
  }

  // 3. return data 
  returnData.invoice = invoice
  return res.status(200).json({
    err_code: null,
    err_msg: null,
    data: returnData
  })
}
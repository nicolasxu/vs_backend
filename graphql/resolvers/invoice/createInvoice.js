// const Request = require('../../../models').Request
// const User = require('../../../models').User

const mongoose = require('mongoose');
const generateSafeId = require('generate-safe-id');

const store = require('../../../utils/store.js')
const Company = require('../../../models').Company
const Template = require('../../../models').Template
const Invoice = require('../../../models').Invoice
const _ = require('lodash')
const intToDateStr = require('../../../utils/intToDateStr.js')
const renderInvoice = require('../../../utils/renderInvoice.js')

module.exports = createInvoice


async function createInvoice(obj, args, context, info) {

  // when reach this point, user is already gurenteed login
  let userId = store.getUserId()

  // 2. toCompanyId is valid
  let toCompanyId = args.input.toCompanyId
  let tValid = mongoose.Types.ObjectId.isValid(toCompanyId)
  if (!tValid) {
    return {
      err_code: 4001,
      err_msg: 'To company id is not valid'
    }
  }
  // 3. templateId is valid
  let templateId = args.input.templateId
  let tValid = mongoose.Types.ObjectId.isValid(templateId)
  if (!tValid) {
    return {
      err_code: 4002,
      err_msg: 'Template id is not valid'
    }
  }

  // 4. make sure dueDate is >= invoice date
  let dueDate = args.input.dueDate
  let invoiceDate = args.input.invoiceDate
  if (!dueDate || !invoiceDate) {
    return {
      err_code: 4003,
      err_msg: 'Invoice date or due date is missing'
    }
  }
  if (dueDate < invoiceDate) {
    return {
      err_code: 4004,
      err_msg: 'dueDate should be after invoice date'
    }
  }

  // 5. fromCompany exists 
  let fromCompanyRaw = await Company.findUserCompany(userId)
  if (!fromCompanyRaw) {
    return {
      err_code: 4005,
      err_msg: 'User company does not exist'
    }
  }
  
  // 6. toCompany is my client, & get toCompany
  let toCompanyRaw = await Company.getMyClientDetail(userId, toCompanyId)
  if (!toCompanyRaw) {
    return {
      err_code: 4006,
      err_msg: 'Can not find to company in your client list'
    }
  }
  
  // 7. template exists
  let template = await Template.findOne({_id: templateId})
  if (!template) {
    return {
      err_code: 4007,
      err_msg: 'Can not find template by templateId'
    }
  }
  // 7. generate invoice number
  // logic: get max sent invoice number, then plus 1
  let maxNumInv = await Invoice.findOne({"fromCompany.cid": fromCompanyRaw._id})
                        .sort({number: -1})
                        .limit(1)
                        .lean()
  let currentNumber
  if (!maxNumInv) {
    currentNumber = 1
  } else {
    currentNumber = maxNumInv.number + 1
  }

  console.log(maxNumInv)

  // 8. parse json dasta
  let items 
  let customData
  try {
    items = JSON.parse(args.input.items)
  } catch (e) {
    return {
      err_code: 4008,
      err_msg: 'Parse items data error'
    }
  }

  try {
    if (args.input.customData && Object.keys(args.input.customData).length > 0 ) {
      customData = JSON.parse(args.input.customData)
    }
    
  } catch (e) {
    return {
      err_code: 4009,
      err_msg: 'Parsing customData error'
    }
  }



  // 8. fill invoice status, payment status
  let renderData = {
    customData: customData,
    dueDate: intToDateStr(dueDate),
    fromCompany: fromCompany,
    invoiceDate: intToDateStr(invoiceDate),  // render need string, no calculation in render at all    
    items: items,
    note: args.input.note,
    number: currentNumber,
    template: template,
    term: args.input.term,
    toCompany: toCompany,
    total: args.input.total
  }
  // 9. render invoice
  let rendered
  try {
    rendered = renderInvoice(renderData)
  } catch (e) {
    console.log('render invoice error', e)
    return {
      err_code: 4010,
      err_msg: 'Render invoice error'
    }
  }
  // 10. generate viewId
  let viewId = generateSafeId()

  // 11. compile mongodb data
  let dbData = {}
  
  dbData.fromCompany = {}
  dbData.fromCompany.cId = fromCompanyRaw._id
  dbData.fromCompany.cName = fromCompany.name
  dbData.fromCompany.uId = userId
  dbData.fromCompany.uName = store.getUserFullname()

  dbData.toCompany = {}
  dbData.toCompany.cId = toCompany._id
  dbData.toCompany.cName = toCompany.name
  dbData.templateId = templateId
  dbData.viewId = viewId
  dbData.number = currentNumber
  dbData.total = args.input.total
  dbData.invoiceDate = invoiceDate
  dbData.dueDate = dueDate
  dbData.term = args.input.term
  dbData.renderedInvoice = rendered
  dbData.status = 'generated'
  dbData.viewed = false
  dbData.paymentStatus = 'not'

  // 12. create invoice
  let created = await Invoice.create(dbData)

  // todo: 
  /* 

    - send alert email
    - send Websocket message

  */

  // 12. return data

  return created
  
}
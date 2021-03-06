const Company = require('../../../models').Company
let store = require('../../../utils/store.js')
let {GraphQLError} = require('graphql')
module.exports = createMyCompany


async function createMyCompany(obj, args, context, info) {
  return;
  let userId = store.getUserId()

  if (!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not valid or empty'
    }
  }

  let company = args.input
  company.members = [userId]
  let userEmail = store.getEmail()
  if (company.invoiceEmails && company.invoiceEmails.length > 0) {
    let emailStr = company.invoiceEmails.join('||')
    if (emailStr.indexOf(userEmail) > -1) {
      // nothing
    } else {
      company.invoiceEmails.push(userEmail)
    }
  } else {
    company.invoiceEmails = [userEmail]
  }

  let result = await Company.createMyCompany(company)

  if (result === 'COMPANY EXIST') {
    return {
      err_code: 4001,
      err_msg: 'User has already created a company'
    }
  } else {
    return result
  }
}
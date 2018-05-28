const Company = require('../models').Company
const User = require('../models').User
const Invoice = require('../models').Invoice


module.exports = replacePrivateCompany


async function replacePrivateCompany(email, companyId) {


  // 1. find all private companies witht this email
  let oldClients = await Company.find({
    creatorCompanyId: {$ne: null} , 
    invoiceEmails: { $in: [email]}
  }, '_id')

  // 2. todo: replace invoice to company, based on oldClients
  await Invoice.update({'toCompany.companyId': {$in: oldClients}}, {'toCompany.companyId': companyId}, {upsert: false})

  console.log('oldClients', oldClients)
  // 3. find out all their owners
  let owners = await Company.find({
    clients: {$in: oldClients}
  }, '_id')
  // 4. remove old clients in owners
  await Company.update({clients: {$in: oldClients }}, {$pullAll: {clients: oldClients }})
  // 5. add new client to owners
  await Company.update({_id: {$in: owners }}, {$push: {clients: companyId}})
  
  // 6. add owners to vendors to companyId
  Company.update({_id: companyId}, {$addToSet: {vendors: {$each: owners}}})

}
const Request = require('../../../models').Request
const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company
const Template = require('../../../models').Template


module.exports = deleteTemplate

async function deleteTemplate(obj, args, context, info) {

  // 1. user login

  let userId = store.getUserId()
  if (!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not valid or empty'
    }
  }

  // 2. is tid exist
  let templateId = args.id
  if (!templateId) {
    return {
      err_code: 4001,
      err_msg: 'Template id does not exist'
    }
  }

  // 3. get my company
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4002,
      err_msg: 'Can not find user company'
    }
  }

  // 4. check tid validity
  let isTidValid = mongoose.Types.ObjectId.isValid(templateId)
  if (!isTidValid) {
    return {
      err_code: 4003,
      err_msg: 'Template id is not valid'
    }
  }

  // 5. tid in company.templates
  let myTemplates = myCompany.templates
  let isMyTemplate = false
  for(let i = 0; i < myTemplates.length; i++) {
    // must convert object id to string!!
    console.log(myTemplates[i].toString())
    console.log('target:', templateId)
    if (myTemplates[i].toString() === templateId ) {
      isMyTemplate = true
      break
    }
  }
  if (!isMyTemplate) {
    return {
      err_code: 4004,
      err_msg: 'Template id is not in my company template list'
    }
  }

  // 4. search in non-default template
  let targetTemplate = await Template.findOne({_id: templateId, isDefault: false }).lean()
  if (!targetTemplate) {
    return {
      err_code: 4005,
      err_msg: 'Can not find non-default template by this id'
    }
  }
  // 5. delete
  let res = await Template.deleteOne({_id: templateId}).lean()
  console.log('del result', res)
  // result: { n: 1, ok: 1 },

  // 6. update my company
  // todo: need to check return value first
  await Company.findOneAndUpdate({_id: myCompany._id}, {$pullAll: {templates: [templateId]} })

  return {
    _id: templateId,
    count: res.result.n,
    message: res.result.ok
  }

}
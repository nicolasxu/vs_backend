const Request = require('../../../models').Request
const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company
const Template = require('../../../models').Template

module.exports = getTemplateById


async function getTemplateById(obj, args, context, info) {

  // 1. user login
  let userId = store.getUserId()
  if (!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not valid or empty'
    }
  }

  // 2. template id
  let templateId = args.id
  if (!templateId) {
    return {
      err_code: 4001,
      err_msg: 'Template ID is empty'
    }
  }
  
  // 3. check if template id is valid
  let isTemplateIdValid = mongoose.Types.ObjectId.isValid(templateId)

  if (!isTemplateIdValid) {
    return {
      err_code: 4002,
      err_msg: 'Template id is not valid'
    }
  }

  // 4. find user company 
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4003,
      err_msg: 'User does not have a company'
    }
  }

  // 4. find the template
  let foundTemplate = await Template.findById(templateId).lean()
  if (!foundTemplate) {
    return {
      err_code: 4004,
      err_msg: 'Can not find template by this id'
    }
  }
  // 5. if it is default, just return it
  if (foundTemplate.isDefault) {
    return foundTemplate
  }

  // 6. if not default, if it is in my company.templates[], return it
  //                    if not, return err msg
  let myTemplates = myCompany.templates
  let isInMyTemplate = false
  for(let i = 0; i < myTemplates.length; i++) {
    if (myTemplates[i] === templateId) {
      isInMyTemplate = true
    }
  }

  if (isInMyTemplate) {
    return foundTemplate
  } else {
    return {
      err_code: 4005,
      err_msg: 'Can not find the template that belongs to the company'
    }
  }
}



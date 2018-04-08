const Request = require('../../../models').Request
const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company
const Template = require('../../../models').Template


async function updateTempate(obj, args, context, info) {

  // 1. user login
  let userId = store.getUserId()
  if (!userId) {
    return {
      err_code: 4000,
      err_msg: 'User token is not valid or empty'
    }
  }

  // 2. get my company
  let myCompany = await Company.findUserCompany(userId)
  if (!myCompany) {
    return {
      err_code: 4001,
      err_msg: 'Can not find user company'
    }
  }  

  // 3. args.id, args.input
  let templateId = args.id
  if (!templateId) {
    return {
      err_code: 4002,
      err_msg: 'Can not find template by id'
    }
  }

  if (!args.input) {
    return {
      err_code: 4003,
      err_msg: 'input object is missing'
    }
  }
  
  let templateInput = {}
  if ('name' in args.input) {
    templateInput.name = args.input.name
  }
  if ('html' in args.input) {
    templateInput.html = args.input.html
  }
  if ('css' in args.input) {
    templateInput.css = args.input.css
  }
  if ('js' in args.input) {
    templateInput.js = args.input.js
  }
  if ('active' in args.input) {
    templateInput.active = args.input.active
  }
  if('isDefault' in args.input) {
    templateInput.isDefault = args.input.isDefault
  }

  // 4. tempalte id exists in company.templates
  let isMyTemplate = false
  let myTemplates = myCompany.templates
  // console.log('myTemplates', myTemplates)

  for(let i = 0; i < myTemplates.length; i++) {
    // must convert object id to string!!
    if (myTemplates[i].toString() === templateId) {
      isMyTemplate = true
      break
    }
  }
  if (!isMyTemplate) {
    return {
      err_code: 4005,
      err_msg: 'Can not find template in your company template array'
    }
  }

  // 5. find template in template collection
  let targetTemplate = await Template.findOne({_id: templateId }).lean()
  if (!targetTemplate) {
    return {
      err_code: 4006,
      err_msg: 'Can not find target template by id'
    }
  }

  // 6. update
  let updatedTemplate = await Template.findOneAndUpdate({_id: templateId}, templateInput, {upsert: false, new: true} ).lean()

  return updatedTemplate

}


module.exports = updateTempate
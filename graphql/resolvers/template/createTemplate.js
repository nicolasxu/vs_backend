
const Request = require('../../../models').Request
const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company
const Template = require('../../../models').Template

module.exports = createTemplate

// can only create company template, not default template
// You need to update database manually to create default template
async function createTemplate(obj, args, context, info) {


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

  // 2. create
  let inputData = args.input
  if (!inputData.name ) {
    return {
      err_code: 4002,
      err_msg: 'Missing template name'      
    }
  }

  if (!inputData.html ) {
    return {
      err_code: 4003,
      err_msg: 'Missing html'      
    }
  }
  if (!inputData.css ) {
    return {
      err_code: 4003,
      err_msg: 'Missing css'      
    }
  }
  let filteredData = {
    name: inputData.name,
    html: inputData.html,
    css: inputData.css,
    js: inputData.js,
    isDefault: false,
    active: inputData.active
  }
  let newTemplate = await Template.create(filteredData).lean()

  // 3. attach to company
  await Company.findOneAndUpdate({_id: myCompany._id}, {$push: {templates: newTemplate._id}}, {upsert: false, new: true})

  // 3. return
  return newTemplate

}
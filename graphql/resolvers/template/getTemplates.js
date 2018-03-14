const Request = require('../../../models').Request
const User = require('../../../models').User

const mongoose = require('mongoose');

const store = require('../../../utils/store.js')
let { GraphQLError } = require('graphql')
const Company = require('../../../models').Company
const Template = require('../../../models').Template




module.exports = getTemplates


async function getTemplates(obj, args, context, info) {

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

  // 2. get my own 
  // only mongoose model has lean() method, promise object does not have lean()
  // if return promise, don't call lean()
  let myTemplates = await Template.getByIds(myCompany.templates).lean()

  // 3. get default
  let defaultTemplates = await Template.find({isDefault: true}) 

  // 4. return combined
  let combined = defaultTemplates.concat(myTemplates)

  // 5. remove duplicates
  let idSet = {}
  combined.forEach((t)=> {
    idSet[t._id.toString()] = t
  })
  let uniqTemplates = []
  for(let key in idSet) {
    uniqTemplates.push(idSet[key])
  }

  return {
    docs: uniqTemplates,
    total: uniqTemplates.length,
    limit: 50,
    offset: 0
  }
}


/* 
example: 


query {
  templates {
    docs {
      _id
      name
      html
      css
      js
      active
      isDefault
      err_code
      err_msg
    }
    total
    limit
    offset
    err_code
    err_msg
  }
}




*/





let userType = require('./user/User.type.js')
let userInput = require('./user/UserInput.input.js')
let usersList = require('./user/UsersList.type.js')
let userTotal = userType + userInput + usersList

let companyType = require('./company/Company.type.js')
let companyInput = require('./company/CompanyInput.input.js')
let companyList = require('./company/CompanyList.type.js')
let companyTotal = companyType + companyInput + companyList

let query = require('./queryEntry.query.js')
let mutation = require('./mutationEntry.mutation.js')

let totalType = userTotal + companyTotal + query + mutation

module.exports = totalType
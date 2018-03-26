let commonTotal = require('./_common/recordDelete.js')

let UserType = require('./user/User.type.js')
let UserInput = require('./user/UserInput.input.js')
let UsersList = require('./user/UsersList.type.js')
let UserTotal = UserType + UserInput + UsersList

let CompanyType = require('./company/Company.type.js')
let CompanyInput = require('./company/CompanyInput.input.js')
let CompanyList = require('./company/CompanyList.type.js')
let CompanyTotal = CompanyType + CompanyInput + CompanyList

let RequestType = require('./request/Request.type.js')
let RequestInput = require('./request/RequestInput.input.js')
let RequestList = require('./request/RequestList.type.js')
let RequestTotal = RequestType + RequestInput + RequestList

let TemplateType = require('./template/Template.type.js')
let TemplateInput = require('./template/TemplateInput.input.js')
let TemplateList = require('./template/TemplateList.type.js')
let TemplateTotal = TemplateType + TemplateInput + TemplateList

let ProductType = require('./product/Product.type.js')
let ProductInput = require('./product/ProductInput.input.js')
let ProductList = require('./product/ProductList.type.js')
let ProductTotal = ProductType + ProductInput + ProductList

let query = require('./queryEntry.query.js')
let mutation = require('./mutationEntry.mutation.js')

let totalType = commonTotal +
                UserTotal + 
                CompanyTotal + 
                RequestTotal +
                TemplateTotal +
                ProductTotal + 
                query + 
                mutation

module.exports = totalType
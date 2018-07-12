var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
let fetch = require( 'node-fetch')

chai.use(chaiAsPromised);

var assert = require('assert');
// var assert = chai.assert;

let hostname = 'http://localhost:3000'

let replacePrivateCompany = require('../utils/replacePrivateCompany.js')
const User = require('../models').User
const Company = require('../models').Company
const Invoice = require('../models').Invoice

let db
let user1





describe('Test replace privete company with newly created company based on same email', function() {

  before( async function () {
    
    db = await require('../db.connection.js').connect(); 

    // 1. create 3 users with 3 companies
    await User.createUser({email: 'testUser1@email.com', password: '123456', companyName: 'Hello Kitty Inc'})
    user1 = await User.findOne({email: 'testUser1@email.com'})
  
    // 2. activate all 3 users
    // console.log('user1', user1)
    //let updatedUser = await User.verifyEmail({email: user1.email , hash: user1.emailVerifyHash})
    // console.log('updatedUser', updatedUser)

  })

  describe('#verifyEmail', function() {
    it('should return no error and create company', async function() {


      let user = await User.findOne({_id: user1._id})
      let body = {
        email: user1.email,
        hash: user1.emailVerifyHash
      }
      let res = await fetch(hostname + '/api/user/verifyemail', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
      })
      let resJson = await res.json()

      assert.equal(resJson.data.verifyEmail.err_code, null, 'no error code')


    });
  })

  describe('#verifyEmail', function() {
    it('user account is active after email verified', async function (){

      let user = await User.findOne({_id: user1._id})
      assert.equal(user.active, true, 'User should be active')
    })
  })

  describe('#verifyEmail', function () {
    it('User company should be created', async function () {
      let user = await User.findOne({_id: user1._id})
      let company = await Company.findOne({_id: user.myCompanyId})
      assert.equal(company.name, 'Hello Kitty Inc', 'Company is created with same name')
    }) 
  })

  describe('#verifyEmail', function () {
    it('creatorCompanyId should be null', async function () {
      let user = await User.findOne({_id: user1._id})
      let company = await Company.findOne({_id: user.myCompanyId})
      assert.equal(company.creatorCompanyId, null, 'creatorCompanyId should be null')
    }) 
  })  

  after(async ()=> {
    // 1. remove those things created
    let user = await User.findOne({email: 'testUser1@email.com'})
    await Company.findOneAndRemove({_id: user.myCompanyId})
    await User.findOneAndRemove({_id: user._id})


    db.close(()=> {
      console.log('db connection closed...')
    })
  })
});
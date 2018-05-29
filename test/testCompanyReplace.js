var assert = require('assert');
let replacePrivateCompany = require('../utils/replacePrivateCompany.js')
const User = require('../models').User
const Company = require('../models').Company
const Invoice = require('../models').Invoice

let db
let user1
let user2
let user3


/*
describe('Test replace privete company with newly created company based on same email', function() {

  before( async function () {
    
    db = await require('../db.connection.js').connect(); 

    // 1. create 3 users with 3 companies
    await User.createUser({email: 'testUser1@email.com', password: '123456'})
    await User.createUser({email: 'testUser2@email.com', password: '123456'})
    await User.createUser({email: 'testUser3@email.com', password: '123456'})
    user1 = await User.findOne({email: 'testUser1@email.com'})
    user2 = await User.findOne({email: 'testUser2@email.com'})
    user3 = await User.findOne({email: 'testUser3@email.com'})
    // 2. activate all 3 users
    console.log('user1', user1)
    await User.verifyEmail({email: user1.email , hash: user1.emailVerifyHash})
    await User.verifyEmail({email: user2.email , hash: user2.emailVerifyHash})
    await User.verifyEmail({email: user3.email , hash: user3.emailVerifyHash})
    // 2. create 3 private companies in each company
    // TODO: create user and company together! 
    // 3. send 3 invoices
    // return Promise.resolve()
  })

  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  })

  after(async ()=> {
    // 1. remove those things created

    db.close(()=> {})
  })
});

*/
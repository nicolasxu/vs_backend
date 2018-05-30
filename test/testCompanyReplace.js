var assert = require('assert');
let replacePrivateCompany = require('../utils/replacePrivateCompany.js')
const User = require('../models').User
const Company = require('../models').Company
const Invoice = require('../models').Invoice
let fetch = require( 'node-fetch')

let hostname = 'http://localhost:3000'
let graphQlEndpoint = 'http://localhost:3000/graphql'

let db
let user1
let user2
let user3
let client1Id


describe.only('Test replace privete company with newly created company based on same email', function() {

  before( async function () {
    
    db = await require('../db.connection.js').connect(); 

    // 1. create 3 users with 3 companies
    await User.createUser({email: 'testUser1@email.com', password: '111111'})
    await User.createUser({email: 'testUser2@email.com', password: '111111'})
    await User.createUser({email: 'testUser3@email.com', password: '111111'})
    user1 = await User.findOne({email: 'testUser1@email.com'})
    user2 = await User.findOne({email: 'testUser2@email.com'})
    user3 = await User.findOne({email: 'testUser3@email.com'})
    // // 2. activate all 3 users
    let body1 = {
      email: user1.email,
      hash: user1.emailVerifyHash      
    }
    await fetch(hostname + '/api/user/verifyemail', {
        method: 'POST',
        body: JSON.stringify(body1),
        headers: {'Content-Type': 'application/json'}
      })
    let body2 = {
      email: user2.email,
      hash: user2.emailVerifyHash      
    }
    await fetch(hostname + '/api/user/verifyemail', {
        method: 'POST',
        body: JSON.stringify(body2),
        headers: {'Content-Type': 'application/json'}
      })

    let body3 = {
      email: user3.email,
      hash: user3.emailVerifyHash      
    }
    await fetch(hostname + '/api/user/verifyemail', {
        method: 'POST',
        body: JSON.stringify(body3),
        headers: {'Content-Type': 'application/json'}
      })         
    
    // 1. add private company
    let query = `
      mutation myMutation ($input: CompanyInput) {
        createMyClient(input: $input) {
          _id
          name
          invoiceEmails
        }
      }
    `
    let payload11 = {
      query: query,
      variables: {
        input: {
          name: 'Gold company 1',
          invoiceEmails: ['gold1@email.com']          
        }

      }
    }
    let payload12 = {
      query: query,
      variables: {
        name: 'Gold company 2',
        invoiceEmails: ['gold2@email.com']
      }
    }
    // 2. get token

    let tokenRes = await fetch(hostname + '/api/user/token', {
      method: 'POST',
      body: JSON.stringify({email: user1.email, password: '111111'}),
      headers: {'Content-Type': 'application/json'}
    })
    let token = (await tokenRes.json()).data.token
    // console.log('token', token)
    let res = await fetch(graphQlEndpoint, {
      credentials: 'include' ,
      method: 'POST',
      body: JSON.stringify(payload11),
      headers:  {'Content-Type': 'application/json', 'x-access-token': token}
    })
    let resJson = await res.json()
    client1Id = resJson.data.createMyClient._id
    console.log('resJson', resJson)
    // console.log('res.headers', res.heade/rs)
    // await fetch(graphQlEndpoint, {
    //   method: 'POST',
    //   body: JSON.stringify(payload12),
    //   headers:  {'Content-Type': 'application/json'}
    // })    

 
  })

  describe('test', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  })

  after(async ()=> {
    // 1. remove those things created
    user1 = await User.findOne({email: 'testUser1@email.com'})
    user2 = await User.findOne({email: 'testUser2@email.com'})
    user3 = await User.findOne({email: 'testUser3@email.com'})

    await User.findOneAndRemove({_id: user1._id})
    await Company.findOneAndRemove({_id: user1.myCompanyId})
    await Company.findOneAndRemove({_id: client1Id})
    await User.findOneAndRemove({_id: user2._id})
    await Company.findOneAndRemove({_id: user2.myCompanyId})
    await User.findOneAndRemove({_id: user3._id})
    await Company.findOneAndRemove({_id: user3.myCompanyId})
    db.close(()=> {})
  })
});


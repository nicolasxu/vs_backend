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
let userToDelete = []
let companyToDelete = []


/* 

                * force account coercion
                         here
                          |
                          |
0         A create B      ^    A invoice B              B pays A
------------------------------------------------------------------------------------------> time



*/

async function createVerifyOneUser(email) {

  await User.createUser({email: email, password: '111111', companyName: email + '_company' })
  user1 = await User.findOne({email: email })
  // verify this user
  let body = {
    email: user1.email,
    hash: user1.emailVerifyHash
  }
  // 2. verify email
  // 3. create company A with user1
  let res = await fetch(hostname + '/api/user/verifyemail', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'}
  })





}

async function createItsPrivateClient(myEmail, clientEmail, companyName) {

      // 5. get token
  let tokenRes = await fetch(hostname + '/api/user/token', {
    method: 'POST',
    body: JSON.stringify({email: myEmail, password: '111111'}),
    headers: {'Content-Type': 'application/json'}
  })
  let token = (await tokenRes.json()).data.token

    // 6. create private client with company X with email2_test01@email.com
    let greatClientBody = {
      invoiceEmails: [clientEmail],
      name: clientEmail + '_' + companyName
    }
    let createClientRes = await fetch(graphQlEndpoint, {
      method: 'POST',
      body: JSON.stringify({query: `
          mutation myMutation ($input: CompanyInput) {
            createMyClient(input: $input) {
              _id
              name
              invoiceEmails
            }
          }
        `, variables: {input: greatClientBody} }),
      headers: {'Content-Type': 'application/json', 'x-access-token': token}
    })
    console.log('createClientRes', await createClientRes.json())  


}

describe.only('01 - user creates a live company B will replace existing privte companies with same email', function () {

  before(async function () {

    db = await require('../db.connection.js').connect();
    
    await createVerifyOneUser('email1_test01@email.com')
    await createItsPrivateClient('email1_test01@email.com', 'email1_test01_client1@email.com', 'client1')
    await createItsPrivateClient('email1_test01@email.com', 'email2_test01_client2@email.com', 'client2')
    

    // 4. register user3, email3@email3.com
    // 5. create company B with user3
    // 6. verify email 
    // 7. create private client with company X with email2_test01@email.com

    // 8. register another userX with email2_test01@email.com
    // 9. create companyX_new with userX
    // 10. companyX_new will replace companyX
 

  })

  describe('#create new company', function(){
    it ('private client will be replaced by the new live company', async function () {

    })
  })

  after(async function () {
   db.close(()=> {
      console.log('db connection closed... in 01')
    })
  })
})
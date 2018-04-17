var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');



let planSchema = new Schema({
  name: String,
  description: String, 
  limit: {
    userNumber: Number,
    clientNumber: Number,
    vendorNumber: Number,
    roleApproval: Boolean,
    quickbooksConnect: Boolean

  },
  planPrice: Number,
  transactionPrice: Number,
  code: String,
  created: String,
  updated: String
})


module.exports = planSchema


/* 
1. Free Plan
  clients: 5
  vendors: 5
  connect quickbooks: yes
  transaction: $0.25 
  user: 1
*/

/* 
2. Business Plan ($49)
  clients: unlimited,
  vendor: unlimited,
  connect quickbooks: yes
  transaction: $0.2
  user: 1

*/

/* 
3. Corporation ($199)
  clients: unlimited,
  vendor: unlimited,
  connect quickbooks: yes
  Dynamic GP, Sage: yes,
  transaction: $0.2
  users: unlimited,
  role & approval: yes
*/




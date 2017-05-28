var messages = require('../messages.js')
var Company = require('../../models').Company
var _ = require('lodash')

module.exports = createOrAddClient

function createOrAddClient(req, res, next) {
  if (req.body.to_id) {
    Company.createClientRequest()
  } else {
    var clientCompany = {
      email: req.body.email,
      name: req.body.name,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      tel: req.body.tel,
      eid: req.body.eid,
      creator: req.session.user._id, //mongoose.Types.ObjectId('579572800d8bb41654d00b44');
      created: new Date().getTime(),
      members: [],
      vendors: [req.session.company._id],
      client: [],
      templates: [],
      active: true,
      public: false
    }
    // company in session is JSON, not mongoose JS object
    var myCompany = new Company(req.session.company)
    // now we can call instance method on company
    myCompany.createClient(clientCompany)
      .then(function (result) {
        req.session.company = result.updatedCompanyModel.toJSON()
        var returnJSON = _.cloneDeep(messages.createClientSuccess)
        returnJSON.data.client = result.createdClient
        res.status(200).json(returnJSON)

      })
      .catch(function (err) {
        res.status(200).json(messages.createClientError)
      })
  }
}

var User = require('../../models/').User
var messages = require('../messages.js')
var checkLogin = require('./checkLogin.js')
var _ = require('lodash')

module.exports = getUserDetail

function getUserDetail(req, res, next) {

  User.findOne({_id: req.session.user._id})
    .then(function(oneUser) {
      if(!oneUser) {
        res.status(200).json(messages.userNotExist);
        return; 
      }
      var returnJson = _.cloneDeep(messages.getUserSuccess);
      returnJson.data.user = oneUser.toJSON();
      delete returnJson.user.password;
      res.status(200).json(returnJson);
      return;
  });

}
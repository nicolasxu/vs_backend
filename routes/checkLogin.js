module.exports = isLogin;

var messages = require('./messages.js');

function isLogin(req, res, next) {
	if(req.session && req.session.authenticated) {
		return next();
	} else {
		res.status(200).json(messages.userNotLogin);
	}
}


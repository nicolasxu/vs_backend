var mongoose = require('mongoose');

var connect = {};
module.exports = connect;
var connectString = 'mongodb://localhost/vitaSpider';
connect.connect = function () {

	mongoose.connect(connectString);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'mongodb connection error:'));
	db.once('open', function() {
		console.log('db connected...');
	});
}
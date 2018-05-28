var mongoose = require('mongoose');

var connect = {};
module.exports = connect;
var connectString = 'mongodb://localhost/vitaSpider';
connect.connect = function () {

	mongoose.connect(connectString);
	let db = mongoose.connection;
	let promise = new Promise((resolve, reject)=> {

    db.on('error',(e)=> {
       console.error.bind(console, 'mongodb connection error:')
       reject(e)
    })


    db.once('open', function() {
      console.log('db connected...')
      resolve(db)
    }) 

  })

  db.on('disconnected', () => {
    console.log(connectString + ' disconnected')
  })  

  process.on('SIGINT', ()=>{
    db.close(()=> {
      console.info('mongoDB closed due to SIGINT')
      process.exit(0)
    })
  })

  process.on('SIGTERM', ()=>{
    db.close(()=> {
      console.info('mongoDB closed due to SIGTERM')
      process.exit(0)
    })
  });  

  return promise
}
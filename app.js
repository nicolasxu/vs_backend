var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var cors = require('cors');
var bodyParser = require('body-parser');
require('./db.connection.js').connect(); // added
var utils = require('./utils')
var app = express();
var routes = require('./routes');
var { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
var { makeExecutableSchema } = require('graphql-tools')

// var sendEmail = require('./utils/sendEmail.js')
// sendEmail('verify_email', {name: 'nick'}, 'xu.shenxin@gmail.com')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


// app.use('/graphql', cors({origin: ['http://localhost:8090'], 
//   methods: ['GET','PUT','POST','OPTIONS','DELETE'], 
//   credentials: true,
//   preflightContinue: true
// })); 
app.use('*', cors({origin: ['http://localhost:8090'], maxAge: 80400, credentials: true}))
app.use('/', routes); // added, need to apply routes after body parser

app.use(express.static(path.join(__dirname, 'public')));


var typeDef = require('./graphql/types')
var resolver = require('./graphql/resolvers')
var schema = makeExecutableSchema({typeDefs: typeDef, resolvers: resolver})
app.post('/graphql', utils.verifyToken, graphqlExpress({schema}))
app.use('/graphiql', utils.verifyToken, graphiqlExpress({endpointURL: '/graphql'}))



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).send('404')

});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


/* 

Use this format to test GraphQL query:
find token in browser console

http://localhost:3000/graphiql?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjU3ODNjYWYyYWViMmU5ZThiN2QyY2MxYyIsImVtYWlsIjoieHUuc2hlbnhpbkBnbWFpbC5jb20iLCJhY3RpdmUiOnRydWV9LCJpYXQiOjE1MjA3MDk5MzMsImV4cCI6MTUyMDcxMzUzM30.SkStsCbes9H0PDFrRY2LPGEnfGp4eeCuVfqKs2yePXw





*/

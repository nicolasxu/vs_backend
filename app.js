var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session'); // added
var RedisStore = require('connect-redis')(session); // added
var cors = require('cors');
var bodyParser = require('body-parser');
require('./db.connection.js').connect(); // added
var utils = require('./utils')
var app = express();
var routes = require('./routes');
var { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
var { makeExecutableSchema } = require('graphql-tools')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secure: true,
  store: new RedisStore({
    resave: true,
    saveUninitialized: true,
    host: 'localhost',
    port: 6379
  }),
  secret: '0FFD9D8D-78F1-4A30-9A4E-0940ADE81111',
  cookie: {path: '/', maxAge: 3600000}
})); // 'http://localhost:8080'

app.use(cors({origin: true, 
  methods: ['GET','PUT','POST','OPTIONS','DELETE'], 
  credentials: true,
  preflightContinue: true
})); 
  // Warning: enable cross origin request for all requests

app.use('/', routes); // added, need to apply routes after body parser, after session setup

app.use(express.static(path.join(__dirname, 'public')));

var typeDefs = require('./graphql/types')

var resolvers = {
  Query: {
    hello(root) {
      return 'world'
    }
  }
}

app.use(utils.verifyToken)

var schema = makeExecutableSchema({typeDefs: typeDefs , resolvers: resolvers})
app.use('/graphql', graphqlExpress({schema}))
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}))



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

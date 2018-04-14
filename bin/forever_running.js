var forever = require('forever-monitor');
  
  var child = new (forever.Monitor)(__dirname + '/www', {
    max: 10,
    silent: true,
    args: []
  });

  child.on('exit', function () {
    console.log('www.js has exited after 10 restarts');
  });

  child.start();
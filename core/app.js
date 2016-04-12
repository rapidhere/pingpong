'use strict';

var express = require('express');
var config = require('../config');
var debuglog = require('./debuglog');
var fs = require('fs');
var path = require('path');

// the web express app
var app = global.app = express();

// only load static middle-ware in static envirounment
if(config.debug) {
  app.use(config.staticRootUrl, express.static(config.staticRoot));
}

// set engine
app.set('views', config.pagesRoot);
app.set('view cache', false);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// set websocket
require('express-ws')(app);

// discover pages
fs.readdir(config.pagesRoot, function(err, files) {
  if(err) {
    debuglog('autodiscover pages failed, ' + err);
    return ;
  }

  files.forEach(function(dname) {
    var viewName = path.join(config.pagesRoot, dname, 'views.js');
    if(! fs.existsSync(viewName)) {
      return;
    }

    require(viewName);
  });

  // use 404 handler
  // app.use(require('./midd/404handler')());
  // use error handler
  app.use(require('./midd/error-handler')());
});


exports.start = function() {
  var server = app.listen(config.port, '0.0.0.0');

  // only start once
  exports.start = function(){};

  // listen to CTRL-C to stop
  if(config.debug) {
    debuglog('server start on port ' + config.port + ', press CTRL-C to stop');
    process.on('SIGINT', function() {
      server.close();
      process.exit(0);
    });
  }
};

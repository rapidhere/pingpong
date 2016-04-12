// some helper in views' logical
'use strict';

var render = require('./template').render;

// a shortcut to call a static web page
var staticPage;
exports.staticPage = staticPage = function(url, page) {
  app.get(url, function(req, res) {
    render(res, page);
  });
};

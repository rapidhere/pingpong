
// Copyright (c) xiaoyouxingkong, All Rights Reserved.
// author: rapidhere@gmail.com

'use strict';

var render = require('../utils/template').render;
var debuglog = require('../debuglog');

// error handler middleware
module.exports = function() {
  return function(req, res, next) {
    debuglog('404 NOT FOUND: ' + req.path);

    res.status(404);
    render(res, '404page');
  };
};

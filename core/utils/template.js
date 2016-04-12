// Copyright (c) xiaoyouxingkong, All Rights Reserved.
// author: rapidhere@gmail.com

// some helper for render
'use strict';

var config = require('../../config');
var _ = require('underscore');

// render helper
var render;
exports.render = render = function(res, view, locals, cb) {
  locals = locals || {};
  locals = _.extend(locals, {
  });

  res.render(view, locals, cb);
};

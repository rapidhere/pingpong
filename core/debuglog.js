// Copyright (c) xiaoyouxingkong, All Rights Reserved.
// author: rapidhere@gmail.com

// we only plan to have a debug logger
'use strict';

var config = require('../config.js');

if(! config.debug) {
  module.exports = function(){};
} else {
  module.exports = function(msg) {
    var date = new Date();
    console.log('[' + date.toISOString() + '] ' + msg);
  };
}

// Copyright (c) xiaoyouxingkong, All Rights Reserved.
// author: rapidhere@gmail.com

'use strict';

var staticPage = require('../../core/utils/view').staticPage;
var log = require('../../core/debuglog');
var wsMobile;
var wsClient;

// entry of `main` pages
staticPage('/', 'main/index');
staticPage('/index', 'main/index');
staticPage('/demo', 'main/demo');

app.ws('/gesture/update', function(ws, req) {
  log('mobile websocket login');

  if(wsMobile)
    wsMobile.close();

  ws.send('1');

  wsMobile = ws;

  ws.on('close', function() {
    log('mobile websocket logout');
  });

  ws.on('message', function(e) {
    log('get gesture: ' + e);
    if(wsClient)
      wsClient.send(e);
  });
});

app.ws('/gesture/get', function(ws, req) {
  log('client websocket login');

  if(wsClient)
    wsClient.close();

  ws.send('1');

  wsClient = ws;

  ws.on('close', function() {
    log('client websocket logout');
  });
});

'use strict';

var staticPage = require('../../core/utils/view').staticPage;
var log = require('../../core/debuglog');

// entry of `main` pages
staticPage('/', 'main/player-client');
staticPage('/mobile-client', 'main/mobile-client');
staticPage('/player-client', 'main/player-client');

(function($, pp){

'use strict';

var $state;
var id;
var peer, conn, peerId;

$(function() {
  $state = $('#state');

  if(pp.utils.hasWebRTC()) {
    load();
  } else {
    $state = $('你当前的浏览器不支持WebRTC');
  }
});

function setState(text) {
  $state.html(text);
}

function load() {
  peerId = pp.uri.getQueries().peer_id;

  id = pp.utils.generateId();
  peer = pp.peer.createPeer(id);

  conn = peer.connect(peerId);
  conn.on('open', function() {
    setState('已连接到player: ' + peerId);
    process();
  });
}

function process() {
  // data
  var alpha, beta, gamma;
  var alphaRate, betaRate, gammaRate;
  var ax, ay, az;
  var gesture = 0;

  var pi = Math.acos(0) * 2.0;
  var azEps = 2.2;

  var initAlpha = 0.0;
  var initGamma = 0.0;
  var rotateInited = false;
  var gammaEps = 0.6;
  var alphaEps = 0.4;
  var recoverEps = 0.63;

  $('#reset').click(function() {
    rotateInited = false;
  });

  $(window).on('deviceorientation', function(e) {
    var o = e.originalEvent;

    alpha = o.alpha;
    beta = o.beta;
    gamma = o.gamma;

    if(! rotateInited) {
      rotateInited = true;
      initAlpha = alpha;
      initGamma = gamma;
    }
  });

  $(window).on('devicemotion', function(e) {
    var m = e.originalEvent;

    ax = m.acceleration.x;
    ay = m.acceleration.y;
    az = m.acceleration.z;

    alphaRate = m.rotationRate.alpha;
    betaRate = m.rotationRate.beta;
    gammaRate = m.rotationRate.gamma;

    detect();
  });

  function detect() {
    if(Math.sqrt(az * az + ax * ax) < azEps)
      return;

    var arca = (alpha - initAlpha) / 180 * pi;
    var arcg = (gamma - initGamma) / 180 * pi;

    var cosa = Math.cos(arca);
    var sina = Math.sin(arca);
    var cosg = Math.cos(arcg);
    var sing = Math.sin(arcg);

    // console.log('#' + gesture + ': ' + cosa + ', ' + sina + ', ' + alphaRate +  ', ' + initAlpha + ', ' + alpha + ', ' + az);
    if(! ((Math.abs(cosg) <= gammaEps) && Math.abs(cosa) <= alphaEps)) {
      if(Math.abs(cosa) > recoverEps)
        gesture = 0;
      return ;
    }

    var _gesture = 0;
    if(sina > 0 && az < 0)
      _gesture = 1;

    if(sina < 0 && az > 0)
      _gesture = -1;

    if(_gesture === 0 || _gesture === gesture)
      return ;

    gesture = _gesture;

    conn.send(gesture);
  }
}

})(jQuery, window.pp);

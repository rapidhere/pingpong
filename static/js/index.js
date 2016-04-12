(function($) {

'use strict';

$(function() {
  // load websocket
  var ws = new WebSocket('ws://10.141.246.71:8888/gesture/update');

  ws.onopen = function() {
    console.log('Connection connected!');
    $('#state').text('已经连接到服务器');
  };

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

  var detect = function() {
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
/*
    if(gesture >= 0)
      console.log('%c' + gesture + ': ' + cosa + ', ' + sina + ', ' + alphaRate + ', ' + az, 'background-color: yellow');
    else
      console.log('%c' + gesture + ': ' + cosa + ', ' + sina + ', ' + alphaRate + ', ' + az, 'background-color: red');
*/
    ws.send(gesture);
  };

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
});

})(jQuery);

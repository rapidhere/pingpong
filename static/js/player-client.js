(function ($, pp) {
'use strict';

var ipV4Exp = /^\d{1,3}(.\d{1,3}){3}$/;
var ipV6Exp = /^[0-9a-f]{0,4}(:[0-9a-f]{0,4}){7}$/;

var id;
var peer;

function showQRCode(peerId) {
  var $qrcodeArea = $('#qrcodeArea');
  var $scanNotification = $('#scanNotification');
  var $loadingContent = $('#centerPopup').find('p');
  var uri = 'http://' +
    pp.config.host + ':' +
    pp.config.port +
    pp.config.mobileClientPath +
    '?peer_id=' + encodeURIComponent(peerId);

  console.log(uri);

  // draw qrcode
  $qrcodeArea.qrcode({
    render: 'canvas',
    width: 400,
    height: 400,
    typeNumber: -1,
    correctLevel: 2,
    background: '#ffffff',
    foreground: '#000000',
    text: uri,
  });
  $loadingContent.hide(1000);
  $qrcodeArea.fadeIn(1000);
  $scanNotification.fadeIn(1000);
}

//TODO: Invoke this after client connected
function hideLayers() {
  var $shader = $('#shader');
  var $layerWrapper = $('#layerWrapper');
  var $scanNotification = $('#scanNotification');

  $scanNotification.fadeOut(200);
  $scanNotification.html("Mobile Device Connected!");
  $scanNotification.fadeIn(800);

  setTimeout(function () {
      $shader.fadeOut(1000);
      $layerWrapper.fadeOut(1000);
  }, 2000)
}

function load(){
  id = pp.utils.generateId();
  peer = pp.peer.createPeer(id);

  showQRCode(id);

  peer.on('connection', function(conn) {
    hideLayers();

    conn.on('data', function(data) {
      // TODO: data
      console.log(data);
    });
  });
}

$(function() {
  if (pp.utils.hasWebRTC()) {
    load();
  }
  // here goes fallbacks on web rtc not support
  else {
    // TODO
  }
});

})(jQuery, window.pp);

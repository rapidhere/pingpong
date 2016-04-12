(function($) {
  var pp = window.pp = {};

  var PATT_IPV4 = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  var PATT_IPV6 = /[a-f0-9]{0,4}:[a-f0-9]{0,4}:.*/;

  // some utils
  pp.utils = {};

  // test if the client support the web rtc
  pp.utils.hasWebRTC = function hasWebRTC() {
    var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    return RTCPeerConnection ? true : false;
  };

  // list ip in local
  // require WebRTC support
  pp.utils.listLocalIPs = function listLocalIPs(conf) {
    var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    if(! RTCPeerConnection) {
      console.error("Web RTC is not supported in this client");
      return;
    }

    conf = conf || {iceServers: []};

    var pc = new RTCPeerConnection(conf);
    pc.createDataChannel('', {reliable: false});

    pc.onicecandidate = function(e) {
      if(! e.candidate) {
        return ;
      }

      // match ip from candidate
      var candi = e.candidate.candidate;

      candi.split(' ').forEach(function(part) {
        if(part.match(PATT_IPV4)) {
          console.log(part);
        } else if(part.match(PATT_IPV6)) {
          console.log(part);
        }
      });
    };

    pc.createOffer(function(offerDesc) {
      pc.setLocalDescription(offerDesc);
    }, function(e) {
      console.warn("offer failed", e);
    });
  };
})(jQuery);

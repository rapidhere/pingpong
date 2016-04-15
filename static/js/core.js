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
    var def = $.Deferred();

    if(! RTCPeerConnection) {
      return def.reject("Web RTC is not supported in this client");
    }

    conf = conf || {iceServers: []};

    var pc = new RTCPeerConnection(conf);
    pc.createDataChannel('', {reliable: false});
    var ips = [];
    var lastIpLength = 0;

    pc.onicecandidate = function(e) {
      if(! e.candidate) {
        return ;
      }

      // match ip from candidate
      var candi = e.candidate.candidate;

      candi.split(' ').forEach(function(part) {
        if(part.match(PATT_IPV4)) {
          ips.push(part);
        } else if(part.match(PATT_IPV6)) {
          ips.push(part);
        }
      });
    };

    pc.createOffer(function(offerDesc) {
      pc.setLocalDescription(offerDesc);
    }, function(e) {
      def.reject('offer failed ' + e);
      if(_loop)
        clearInterval(_loop);
    });

    // loop counter
    var _loop = setInterval(function() {
      if(ips.length == lastIpLength) {
        def.resolve(ips);
        clearInterval(_loop);
        return ;
      }

      lastIpLength = ips.length;
    }, 1000);

    return def.promise();
  };
})(jQuery);

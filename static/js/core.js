(function($, pp) {
  var PATT_IPV4 = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  var PATT_IPV6 = /[a-f0-9]{0,4}:[a-f0-9]{0,4}:.*/;

  // peer
  pp.peer = {};

  pp.peer.createPeer = function(id) {
    var peer = new Peer(id, {
      host: pp.config.host,
      port: pp.config.port,
      path: pp.config.peerPath,
    });

    return peer;
  };

  // some utils
  pp.utils = {};

  // generate id
  pp.utils.generateId = function() {
    var date = new Date();
    return '' + date.getTime() + '-' + parseInt(Math.random() * 100000);
  };

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

  // uri helpers
  pp.uri = {};

  pp.uri.parseURI = function parseURI(text) {
    // parseUri 1.2.2
    // (c) Steven Levithan <stevenlevithan.com>
    // MIT License

    function parseUri (str) {
      var o   = parseUri.options,
          m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
          uri = {},
          i   = 14;

      while (i--) uri[o.key[i]] = m[i] || "";

      uri[o.q.name] = {};
      uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
      });

      return uri;
    };

    parseUri.options = {
      strictMode: false,
      key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
      q: {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };

    return parseUri(text);
  };

  pp.uri.getQueries = function getQueries() {
    return this.parseURI(window.location.href).queryKey;
  };
})(jQuery, window.pp);

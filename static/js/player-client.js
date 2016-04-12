(function($, pp) {

'use strict';

// try to get ips
if(pp.utils.hasWebRTC()) {
  pp.utils.listLocalIPs()
}
// here goes fallbacks on web rtc not support
else {
  // TODO: fallbacks
}

})(jQuery, window.pp);

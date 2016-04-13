(function($, pp) {

'use strict';

// try to get ips
if(pp.utils.hasWebRTC()) {
  pp.utils.listLocalIPs()
  .done(function(ips) {
    console.log(ips);
  })
  .fail(function(err) {
    console.log(err);
  });
}
// here goes fallbacks on web rtc not support
else {
  // TODO: fallbacks
}

})(jQuery, window.pp);

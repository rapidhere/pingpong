'use strict';

var ipV4Exp = /^\d{1,3}(.\d{1,3}){3}$/;
var ipV6Exp = /^[0-9a-f]{0,4}(:[0-9a-f]{0,4}){7}$/;

(function ($, pp) {

    function showQRCode(ipAddress) {
        var $qrcodeArea = $('#qrcodeArea');
        var $scanNotification = $('#scanNotification');
        var $loadingContent = $('#centerPopup').find('p');
        // draw qrcode
        $qrcodeArea.qrcode({
            render: "canvas",
            width: 400,
            height: 400,
            typeNumber: -1,
            correctLevel: 2,
            background: "#ffffff",
            foreground: "#000000",
            text: "http://172.16.66.100:8888/mobile-client?ips=" + ipAddress
        });
        $loadingContent.hide(1000);
        $qrcodeArea.fadeIn(1000);
        $scanNotification.fadeIn(1000);
    }

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

// try to get ips
    if (pp.utils.hasWebRTC()) {
        pp.utils.listLocalIPs()
            .done(function (ips) {
                console.log(ips);
                setTimeout(function () {
                    showQRCode(JSON.stringify(ips));
                }, 0);
            })
            .fail(function (err) {
                console.log(err);
            });
    }
// here goes fallbacks on web rtc not support
    else {
        // TODO: fallbacks
        var ipAddress = null;
        while (ipAddress == null) {
            ipAddress = prompt('Cannot Resolve your PC\'s IP address, Please input manually');
            ipAddress = ipAddress.trim();
            if ((!ipV4Exp.test(ipAddress)) && (!ipV6Exp.test(ipAddress))) {
                ipAddress == null;
            }
        }
        var ips = [];
        ips.push(ipAddress);
        console.log(ips);
        setTimeout(function () {
            showQRCode(JSON.stringify(ips));
        }, 0);
    }

})(jQuery, window.pp);

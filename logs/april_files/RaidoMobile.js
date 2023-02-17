
$(document).ready(function () {

    /* prevent open in new window */
    if (("standalone" in window.navigator) && window.navigator.standalone) {
        var noddy, remotes = true;
        document.addEventListener('click', function (event) {
            noddy = event.target;
            // Bubble up until we hit link or top HTML element.
            while (noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
                noddy = noddy.parentNode;
            }
            if ('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes)) {
                event.preventDefault();
                document.location.href = noddy.href;
            }

        }, false);
    }

    //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    // clicking on a link will display spinning wheel, except elements marked as NoAction
// temp disabled /CJM
//    $("a:not(.NoAction)").click(function () {
//        fadeToGray();
//    });

    // menu click
    $("#linkMenu").click(function () {

        $("#tabMasterMenu").toggle();

        // calc height
        var headerHeight = $("#menuslider .touchslider-item .header").height();
        var ulHeight = 0;
        $("#menuslider .touchslider-item ul").each(function () {
            var h = $(this).height();
            if (h > ulHeight)
                ulHeight = h;
        });

        $("#menuslider .touchslider-viewport").height(ulHeight + headerHeight);
    });

    // menu slider
    var count = $('#menuslider .touchslider-item').length;

    $('#menuslider .touchslider-nav').html('');
    for (var i = 0; i < count; i++) {
        var el = $('<span class="touchslider-nav-item"></span>');
        if (i == 0) {
            el.addClass('touchslider-nav-item-current');
        }
        $('#menuslider .touchslider-nav').append(el);
    }
    
    $(".touchslider").touchSlider({/*options*/ });
    /*
    $('#slider').touchSlider({
    mode: 'index',
    center: true,
    single: true,
    onChange: function (prev, curr) {
    $('#tabs a.tablink').removeClass('active');
    $('#tabs a.tablink').filter(function (i) { return i == curr }).addClass('active');
    },
    onStart: function () {
    var count = $('#slider').get(0).getCount();
    $('#tabs').html('');
    for (var i = 0; i < count; i++) {
    var el = $('<a href="#" class="tablink"><div></div></a>');
    el.attr('index', i);
    if (i == 0) {
    el.addClass('active');
    }
    $('#tabs').append(el);

    el.bind('click', function () {
    $('#slider').get(0).moveTo($(this).attr('index'));
    return false;
    });
    }
    }
    });*/

    // nice box text
    $('input[type="text"]').each(function () {

        if (this.value == '' && typeof ($(this).attr('title')) != 'undefined') {
            this.value = $(this).attr('title');
            $(this).addClass('textlabel');
        }
        $(this).focus(function () {
            if (this.value == $(this).attr('title')) {
                this.value = '';
                $(this).removeClass('textlabel');
            }
        });
        $(this).blur(function () {
            if (this.value == '' && typeof ($(this).attr('title')) != 'undefined') {
                this.value = $(this).attr('title');
                $(this).addClass('textlabel');
            }
        });
    });
    var _goBackClicked = false;
    $('.go-back-button').click(function () {
        // Prevent double click
        if (_goBackClicked) { 
            return false;
        }
        // Prevent go to login page
        if (checkIfPrevPageIsLogin()) {
            return false;
        }
        if (history.length > 1) {
            history.back();
            $('.go-back-button .overlay').addClass('disabled');
            _goBackClicked = true;
            return true;
        }
        $('.go-back-button .overlay').addClass('disabled');
        return false;
    });
    if (checkIfPrevPageIsLogin()) {
        $('.go-back-button .overlay').addClass('disabled');
    }
});

function checkIfPrevPageIsLogin() {
    var referrer = document.referrer;
    return referrer && (referrer.search('Default.aspx') !== -1 || referrer[referrer.length - 1] === '/');
}

function fadeToGray() {
    var diff = $('#header').height() + $('#wrapper').height() - window.innerHeight;

    $('.fadedGreyBackgroundSpin').css({ opacity: 0.4, 'width': $('#wrapper').width(), 'height': window.innerHeight }).fadeIn("slow");
    $('.fadedGreyBackground').css({ opacity: 0.4, 'top': window.innerHeight, 'width': $('#wrapper').width(), 'height': diff }).fadeIn("slow");
}

function fadeOutGray() {
    $('.fadedGreyBackgroundSpin').fadeOut("slow");
    $('.fadedGreyBackground').fadeOut("slow");
}

function hideAddressBar() {
    if (!window.location.hash) {
        setTimeout(function () { window.scrollTo(0, 1); }, 50);
    }
}

window.addEventListener("load", function () { if (!window.pageYOffset) { hideAddressBar(); } });
window.addEventListener("orientationchange", hideAddressBar);

/* Scroll to element */
jQuery.fn.extend(
{
    scrollTo: function (offset, speed, easing) {
        return this.each(function () {
            var targetOffset = $(this).offset().top + offset;
            $('html,body').animate({ scrollTop: targetOffset }, speed, easing);
        });
    }
});

/*
* Date Format 1.2.3
* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
* MIT license
*
* Includes enhancements by Scott Trenda <scott.trenda.net>
* and Kris Kowal <cixar.com/~kris.kowal/>
*
* Accepts a date, a mask, or a date and a mask.
* Returns a formatted version of the given date.
* The date defaults to the current date/time.
* The mask defaults to dateFormat.masks.default.
*/

var dateFormat = function () { var a = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, b = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, c = /[^-+\dA-Z]/g, d = function (a, b) { a = String(a); b = b || 2; while (a.length < b) a = "0" + a; return a }; return function (e, f, g) { var h = dateFormat; if (arguments.length == 1 && Object.prototype.toString.call(e) == "[object String]" && !/\d/.test(e)) { f = e; e = undefined } e = e ? new Date(e) : new Date; if (isNaN(e)) throw SyntaxError("invalid date"); f = String(h.masks[f] || f || h.masks["default"]); if (f.slice(0, 4) == "UTC:") { f = f.slice(4); g = true } var i = g ? "getUTC" : "get", j = e[i + "Date"](), k = e[i + "Day"](), l = e[i + "Month"](), m = e[i + "FullYear"](), n = e[i + "Hours"](), o = e[i + "Minutes"](), p = e[i + "Seconds"](), q = e[i + "Milliseconds"](), r = g ? 0 : e.getTimezoneOffset(), s = { d: j, dd: d(j), ddd: h.i18n.dayNames[k], dddd: h.i18n.dayNames[k + 7], m: l + 1, mm: d(l + 1), mmm: h.i18n.monthNames[l], mmmm: h.i18n.monthNames[l + 12], yy: String(m).slice(2), yyyy: m, h: n % 12 || 12, hh: d(n % 12 || 12), H: n, HH: d(n), M: o, MM: d(o), s: p, ss: d(p), l: d(q, 3), L: d(q > 99 ? Math.round(q / 10) : q), t: n < 12 ? "a" : "p", tt: n < 12 ? "am" : "pm", T: n < 12 ? "A" : "P", TT: n < 12 ? "AM" : "PM", Z: g ? "UTC" : (String(e).match(b) || [""]).pop().replace(c, ""), o: (r > 0 ? "-" : "+") + d(Math.floor(Math.abs(r) / 60) * 100 + Math.abs(r) % 60, 4), S: ["th", "st", "nd", "rd"][j % 10 > 3 ? 0 : (j % 100 - j % 10 != 10) * j % 10] }; return f.replace(a, function (a) { return a in s ? s[a] : a.slice(1, a.length - 1) }) } } (); dateFormat.masks = { "default": "ddd mmm dd yyyy HH:MM:ss", shortDate: "m/d/yy", mediumDate: "mmm d, yyyy", longDate: "mmmm d, yyyy", fullDate: "dddd, mmmm d, yyyy", shortTime: "h:MM TT", mediumTime: "h:MM:ss TT", longTime: "h:MM:ss TT Z", isoDate: "yyyy-mm-dd", isoTime: "HH:MM:ss", isoDateTime: "yyyy-mm-dd'T'HH:MM:ss", isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'" }; dateFormat.i18n = { dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] }; Date.prototype.format = function (a, b) { return dateFormat(this, a, b) }



/*!
* Copyright (c) 2009-2011 Andreas Blixt <andreas@blixt.org>
* Contributors: Aaron Ogle <aogle@avencia.com>,
*               Matti Virkkunen <mvirkkunen@gmail.com>,
*               Simon Chester <simonches@gmail.com>
* http://github.com/blixt/js-hash
* MIT License: http://www.opensource.org/licenses/mit-license.php
*
* Hash handler
* Keeps track of the history of changes to the hash part in the address bar.
*/
/* WARNING for Internet Explorer 7 and below:
* If an element on the page has the same ID as the hash used, the history will
* get messed up.
*
* Does not support history in Safari 2 and below.
*
* Example:
*     function handler(newHash, initial) {
*         if (initial)
*             alert('Hash is "' + newHash + '"');
*         else
*             alert('Hash changed to "' + newHash + '"');
*     }
*     Hash.init(handler);
*     Hash.go('abc123');
*
*
* Updated by Simon Chester (simonches@gmail.com) on 2011-05-16:
*   - Removed the need for blank.html and the iframe argument by creating the
*     iframe on initialization.
*
* Updated by Matti Virkkunen (mvirkkunen@gmail.com) on 2009-11-16:
*   - Added second argument to callback that indicates whether the callback is
*     due to initial state (true) or due to an actual change to the hash
*     (false).
*
* Updated by Aaron Ogle (aogle@avencia.com) on 2009-08-11:
*   - Fixed bug where Firefox automatically unescapes location.hash but no
*     other browsers do. Always get the hash by parsing location.href and
*     never use location.hash.
*/

var Hash = (function () {
    var 
    // Import globals
window = this,
documentMode = document.documentMode,
history = window.history,
    // Plugin variables
callback, hash,
    // IE-specific
iframe,

getHash = function () {
    // Internet Explorer 6 (and possibly other browsers) extracts the query
    // string out of the location.hash property into the location.search
    // property, so we can't rely on it. The location.search property can't be
    // relied on either, since if the URL contains a real query string, that's
    // what it will be set to. The only way to get the whole hash is to parse
    // it from the location.href property.
    //
    // Another thing to note is that in Internet Explorer 6 and 7 (and possibly
    // other browsers), subsequent hashes are removed from the location.href
    // (and location.hash) property if the location.search property is set.
    //
    // Via Aaron: Firefox 3.5 (and below?) always unescape location.hash which
    // causes poll to fire the hashchange event twice on escaped hashes. This
    // is because the hash variable (escaped) will not match location.hash
    // (unescaped.) The only consistent option is to rely completely on
    // location.href.
    var index = window.location.href.indexOf('#');
    return (index == -1 ? '' : window.location.href.substr(index + 1));
},

    // Used by all browsers except Internet Explorer 7 and below.
poll = function () {
    var curHash = getHash();
    if (curHash != hash) {
        hash = curHash;
        callback(curHash, false);
    }
},

    // From:
    // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
isHashChangeSupported = function () {
    var eventName = 'onhashchange';
    var isSupported = (eventName in document.body);
    if (!isSupported) {
        document.body.setAttribute(eventName, 'return;');
        isSupported = typeof document.body[eventName] == 'function';
    }

    // documentMode logic from YUI to filter out IE8 Compat Mode (which
    // generates false positives).
    return isSupported && (document.documentMode === undefined ||
                           document.documentMode > 7);
},

createIframe = function () {
    var tempEl = document.createElement();
    tempEl.innerHTML = '<iframe src="javascript:void(0)" tabindex="-1" ' +
                       'style="display: none;"></iframe>';
    var frame = tempEl.childNodes[0];
    document.body.appendChild(frame);
    return frame;
},

    // Used to create a history entry with a value in the iframe.
setIframe = function (newHash) {
    try {
        var doc = iframe.contentWindow.document;
        doc.open();
        doc.write('<html><body>' + newHash + '</body></html>');
        doc.close();
        hash = newHash;
    } catch (e) {
        setTimeout(function () { setIframe(newHash); }, 10);
    }
},

    // Used by Internet Explorer 7 and below to set up an iframe that keeps track
    // of history changes.
setUpIframe = function () {
    // Don't run until access to the body is allowed.
    try {
        iframe = createIframe();
    } catch (e) {
        setTimeout(setUpIframe, 10);
        return;
    }

    // Create a history entry for the initial state.
    setIframe(hash);
    var data = hash;

    setInterval(function () {
        var curData, curHash;

        try {
            curData = iframe.contentWindow.document.body.innerText;
            if (curData != data) {
                data = curData;
                window.location.hash = hash = curData;
                callback(curData, true);
            } else {
                curHash = getHash();
                if (curHash != hash) setIframe(curHash);
            }
        } catch (e) {
        }
    }, 50);
};

    return {
        init: function (cb) {
            // init can only be called once.
            if (callback) return;

            callback = cb;

            // Keep track of the hash value.
            hash = getHash();
            cb(hash, true);

            if (isHashChangeSupported()) {
                if (window.addEventListener) {
                    window.addEventListener('hashchange', poll, false);
                } else if (window.attachEvent) {
                    window.attachEvent('onhashchange', poll);
                }
            } else {
                // Run specific code for Internet Explorer.
                if (window.ActiveXObject) {
                    if (!documentMode || documentMode < 8) {
                        // Internet Explorer 5.5/6/7 need an iframe for history
                        // support.
                        setUpIframe();
                    }
                } else {
                    // Change Opera navigation mode to improve history support.
                    if (history.navigationMode) {
                        history.navigationMode = 'compatible';
                    }

                    setInterval(poll, 50);
                }
            }
        },

        go: function (newHash) {
            // Cancel if the new hash is the same as the current one, since there
            // is no cross-browser way to keep track of navigation to the exact
            // same hash multiple times in a row. A wrapper can handle this by
            // adding an incrementing counter to the end of the hash.
            if (newHash == hash) return;
            if (iframe) {
                setIframe(newHash);
            } else {
                window.location.hash = hash = newHash;
                callback(newHash, false);
            }
        }
    };
})();


/*!
* Copyright (c) 2009-2011 Andreas Blixt <andreas@blixt.org>
* Contributors: Simon Chester <simonches@gmail.com>
* http://github.com/blixt/js-hash
* MIT License: http://www.opensource.org/licenses/mit-license.php
*
* jQuery hash plugin (Depends on jQuery, Hash)
* Plugin for detecting changes to the hash and for adding history support for
* hashes to certain browsers.
*/
/* Example:
*     // Add events before calling init to make sure they are triggered for
*     // initial hash value.
*     $('div#log').hashchange(function (e, newHash) {
*         $(this).prepend('<p>New hash: <b>"' + newHash + '"</b></p>');
*     });
*     // Initialize.
*     $.hash.init();
*     $.hash.go('abc123');
*     // Changes hash when the anchor is clicked. Also automatically sets the
*     // href attribute to "#def456", unless a second argument with a false
*     // value is supplied.
*     $('a#my-anchor').hash('def456');
*
* WARNING for Internet Explorer 7 and below:
* If an element on the page has the same ID as the hash used, the history will
* get messed up.
*
* Does not support history in Safari 2 and below.
*
*
* Updated by Simon Chester (simonches@gmail.com) on 2011-05-16:
*   - Updated to reflect Hash.js no longer needing iframe argument
*/

(function (jQuery, Hash) {
    var 
    // Plugin settings
eventName = 'hashchange',
eventDataName = 'hash.fn',
init,
    // Import globals
window = this,
documentMode = document.documentMode,

    // Called whenever the hash changes.
callback = function (newHash) {
    jQuery.event.trigger(eventName, [newHash]);
};

    jQuery.hash = {
        init: function () {
            // init can only be called once.
            if (init) return;
            init = 1;

            Hash.init(callback);
        },

        go: Hash.go
    };

    jQuery.fn.hash = function (newHash, changeHref) {
        var fn = this.data(eventDataName);
        if (fn) this.unbind('click', fn);

        if (typeof newHash == 'string') {
            fn = function () { Hash.go(newHash); return false; };
            this.data(eventDataName, fn);
            this.click(fn);
            if (changeHref || changeHref === undefined)
                this.attr('href', '#' + newHash);
        }

        return this;
    };

    jQuery.fn[eventName] = function (fn) {
        return this.bind(eventName, fn);
    };
})(jQuery, Hash);

/* CONST */

var cDBUserName = "AvxUsername";
var cDBUserPass = "AvxUserpass";
var cDBRoster = "AvxRoster";

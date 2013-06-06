/*  --------------------------------------------------

    Request-JS
    by Michael Donohoe (@donohoe)
    https://github.com/donohoe/request-js

    - - - - - - - - - -

    Copyright (C) 2012 Michael Donohoe (http://donohoe.io)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

    -------------------------------------------------- */
    
var Request = (function(){
	var head      = document.getElementsByTagName('head')[0];
	var scripts   = document.getElementsByTagName("script");
	var pathBell  = ""; // You can pass this in, or set it to the relative path location of the bell.html file;
	var uriTunnel = ""; // You can pass this in, or set it to the full path of the xmlhttprequest.html file hosted on remote server;

	function watch(el, ev, fn) {
		function normalize(event) {
			event.stopPropagation = event.stopPropagation || function() { event.cancelBubble = true; };
			event.preventDefault  = event.preventDefault  || function() { this.returnValue  = false; };
			event.target          = event.target          || event.srcElement;
			return event;
		}

		if (el.addEventListener) {
			el.addEventListener(ev, fn, false);
		} else if (el.attachEvent) {
			var handler = function() { return fn.call(el, normalize(window.event)); };
			el.attachEvent('on' + ev, handler);
		}
		return el;
	}

	function stopWatching(el, ev, fn) {
		var handler = (typeof fn.handler == 'function') ? fn.handler : fn;
		if (el.removeEventListener) {
			el.removeEventListener(ev, handler, false);
		} else if (el.detachEvent) {
			el.detachEvent('on' + ev, handler);
		}
	}

	function Request(url, options) {
		pathBell  = (options.bell)   ? options.bell   : pathBell;
		uriTunnel = (options.tunnel) ? options.tunnel : uriTunnel;
		method    = (options.method) ? options.method : 'get';
		if (!url)       return;
		if (!uriTunnel) return;
		if (!pathBell)  throw 'Use path relative to "bell" file. (filename.js?bell=/path/to/file)';
		if (pathBell == window.location.pathname && window != window.top) throw 'Aborting. Load in the tunnel iframe';
		iframeRequest(url, options);
	}

	function iframeRequest(url, options) {
		var callback = options.callback;
		var iframe = document.createElement('iframe');
		iframe.style.position = 'absolute';
		iframe.style.top      = '-9999px';
		iframe.style.display  = 'none';
		head.appendChild(iframe);

		watch(iframe, 'load', processResponse);

		iframe.src = uriTunnel +
					'?url='    + encodeURIComponent(url) +
					'&method=' + options.method +
					'&params=' + encodeURIComponent(options.params) +
					'&bell='   + window.location.protocol + '//' + window.location.host + pathBell;

		function processResponse(){
			try {
				if (iframe.contentWindow.location && iframe.contentWindow.location.pathname == pathBell) {
					stopWatching(iframe, 'load', processResponse);
					var responseText = iframe.contentWindow.name;
					if (responseText) {
						var response = JSON.parse(responseText);
						if (response.status && response.status == 200 && typeof options.onSuccess === 'function') {
							options.onSuccess(response);
						}
						if (typeof options.callback === 'function') {
							options.callback(response);
						}
						window.setTimeout(function(){ head.removeChild(iframe); }, 468);
					}
				}
			} catch(e) {
				console.log(e);
			}
		}
	}

	return Request;
})();


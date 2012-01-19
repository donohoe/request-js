Request.js - Simple cross-domain requests
=========================================

Request.js lets you make cross-domain requests to different domain or sub-domain for JSON data sources. For a simple demonstration, visit the [demo page][dp] or [download a tagged release][dl] and open `demo` directory.

It uses the window.name technique for secure cross-domain browser based data transfer. It works by loading a external HTML file on the remote domain in an iframe. The HTML file makes a local `XMLHttpRequest` request, sets its `window.name` to the string content of the response. The value of `window.name` is available as a response.

This project was originally put together here so I could host JSON on a DropBox account and access it from anywhere without a proxy. It is not limited at all to just JSON.

This project does not rely on jQuery or any other framework except for [an implementation][json2] of `JSON.parse`. It does however require a little thought to the initial setup.

[dp]: http://donohoe.io/projects/hn/
[dl]: https://github.com/donohoe/request-js/demo/
[json2]: https://github.com/douglascrockford/JSON-js/blob/master/json2.js

Setup
-----

To use Request.js, it's easiest to [download a packaged release][dl].

The parent directory contains these two files; `request.js` and `bell.html`

Moved these to the site in which you intend to make the cross-domain requests from.

There are two files of interest within the `remote-site` directory; `json2-min.js` and `xmlhttprequest.html`

Move these to the remote site in which contains JSON files you intend to access.

Usage
-----

Here is a simple example of how to make a request. In this case it is assumed that `request.js` and `bell.html` are in the same directory as the example.

Include the following in the `<head>` of your document:
	
	<script src='/path/to/request.js'></script>

And the example:

	<script>
	var url = "http://dl.dropbox.com/u/362483/Project/HN/news.js"; // Regenerated from Hacker News (http://news.ycombinator.com/) every 30 minutes

    var options  = {
		callback: function(response){
			if (response.status!=200) {
				return;
			}
			console.log(response.responseText);
		},
		bell:    "bell.html",
		tunnel:  "http://dl.dropbox.com/u/123029/request/xmlhttprequest.html"
    };

	new Request(url, options);
    </script>

The value for `bell` must be the full relative path to website. So if the full path to the file is:

    http://www.example.com/path/to/bell.html
	
Then you should have:

		bell:    "/path/to/bell.html",
		tunnel:  "http://dl.dropbox.com/u/123029/request/xmlhttprequest.html"

Instead of passing `bell` and `tunnel` each time you make a request, you can modify `request.js` to provide default values:

	var pathBell  = "bell.hmtl";
	var uriTunnel = "http://dl.dropbox.com/u/123029/request/xmlhttprequest.html";

Passing values for `bell` and `tunnel` in a request will over-ride defaults.

Credit
------

The heavy lifting was done by [Pau Santamases][pau] a good many years ago when we both worked on a now defunct project called TimesPeople. Also, to Douglas Crockford for `json-js` script.

Further Reading
---------------

[Cross-Domain Communication with IFrames][xdomain]

[window.name Transport][wtransport]

[pau]: https://twitter.com/pausantesmasses
[xdomain]: http://softwareas.com/cross-domain-communication-with-iframes
[wtransport]: http://www.sitepen.com/blog/2008/07/22/windowname-transport/